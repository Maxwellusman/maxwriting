import { GetServerSideProps } from 'next';
import dbConnect from '@/lib/mongodb';
import BlogPost, { BlogPostLean } from '@/models/BlogPost';
import mongoose from 'mongoose';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BlogPostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    slug: string;
    imageUrl?: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    focusKeyword?: string;
    writer?: string;
    linkedinUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function EditPost({ post }: BlogPostProps) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.imageUrl || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [metaTitle, setMetaTitle] = useState(post.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(post.metaDescription || '');
  const [keywords, setKeywords] = useState(post.keywords?.join(', ') || '');
  const [focusKeyword, setFocusKeyword] = useState(post.focusKeyword || '');
  const [writer, setWriter] = useState(post.writer || '');
  const [linkedinUrl, setLinkedinUrl] = useState(post.linkedinUrl || '');
  const [seoScore, setSeoScore] = useState(0);
  const [contentStats, setContentStats] = useState({
    titleLength: post.title.length,
    excerptLength: post.excerpt?.length || 0,
    metaDescLength: post.metaDescription?.length || 0,
    contentWords: 0,
    contentSizeKB: 0,
    imageCount: (post.content.match(/<img/g) || []).length,
    h2Count: (post.content.match(/<h2/g) || []).length,
    h3Count: (post.content.match(/<h3/g) || []).length,
    linkCount: (post.content.match(/<a /g) || []).length,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Tiptap Editor with all extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold my-2',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 p-1 rounded',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg mx-auto max-w-full h-auto',
        },
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-5',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-5',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic',
        },
      }),
      Code,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: post.content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none',
      },
      handleDOMEvents: {
        drop: (view, event) => {
          event.preventDefault();
          const files = event.dataTransfer?.files;
          if (files && files.length) {
            const file = files[0];
            if (file.type.includes('image/')) {
              const reader = new FileReader();
              reader.onload = () => {
                const pos = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                if (pos && reader.result) {
                  view.dispatch(
                    view.state.tr
                      .setMeta('uploadImage', true)
                      .insert(pos.pos, view.state.schema.nodes.image.create({
                        src: reader.result as string
                      }))
                  );
                }
              };
              reader.readAsDataURL(file);
            }
          }
          return true;
        },
      },
    },
    onUpdate: () => {
      updateContentStats();
    },
  });

  const updateContentStats = () => {
    const content = editor?.getHTML() || '';
    const textContent = editor?.getText() || '';
    const contentSizeBytes = new Blob([content]).size;
    const contentSizeKB = Math.round(contentSizeBytes / 1024);

    if (contentSizeKB > 2048) {
      toast.error('Content size exceeds 2MB limit! Please reduce content size.');
    }

    setContentStats({
      titleLength: title.length,
      excerptLength: excerpt.length,
      metaDescLength: metaDescription.length,
      contentWords: textContent.split(/\s+/).filter(Boolean).length,
      contentSizeKB,
      imageCount: (content.match(/<img/g) || []).length,
      h2Count: (content.match(/<h2/g) || []).length,
      h3Count: (content.match(/<h3/g) || []).length,
      linkCount: (content.match(/<a /g) || []).length,
    });
  };

  useEffect(() => {
    if (editor && !editor.isDestroyed && post.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, 'text/html');
      const images = doc.querySelectorAll('img');
      
      images.forEach(img => {
        if (img.src.startsWith('data:')) {
          // Base64 image - keep as is
        } else {
          // External image - ensure it's loaded properly
          img.setAttribute('data-src', img.src);
        }
      });

      editor.commands.setContent(doc.body.innerHTML);
      updateContentStats();
    }
  }, [post.content, editor]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  useEffect(() => {
    let score = 0;
    
    if (title.length >= 50 && title.length <= 60) score += 20;
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    
    const wordCount = contentStats.contentWords;
    if (wordCount >= 300) score += 15;
    
    const desc = metaDescription || excerpt;
    if (desc.length >= 120 && desc.length <= 160) score += 15;
    
    if (imagePreview) score += 10;
    
    if (contentStats.h2Count > 0) score += 10;
    
    if (contentStats.linkCount > 0) score += 5;
    
    if (focusKeyword && editor?.getText().toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 10;
    }
    
    if (writer) score += 5;
    
    setSeoScore(Math.min(100, score));
  }, [title, excerpt, metaDescription, focusKeyword, editor, imagePreview, contentStats, writer]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-'));
    
    if (!metaTitle) {
      setMetaTitle(newTitle.length > 60 ? newTitle.substring(0, 57) + '...' : newTitle);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size exceeds 2MB limit!');
        return;
      }
      setImage(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDeviceImageToEditor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size exceeds 2MB limit!');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        editor?.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeoRecommendations = () => {
    const recommendations = [];
    
    if (title.length < 50 || title.length > 60) {
      recommendations.push('Title should be 50-60 characters');
    }
    
    if (!focusKeyword) {
      recommendations.push('Add a focus keyword for better SEO');
    } else {
      if (!title.toLowerCase().includes(focusKeyword.toLowerCase())) {
        recommendations.push('Include focus keyword in title');
      }
      if (!slug.includes(focusKeyword.toLowerCase())) {
        recommendations.push('Include focus keyword in slug');
      }
    }
    
    if (contentStats.contentWords < 300) {
      recommendations.push('Content should be at least 300 words');
    }
    
    if (contentStats.h2Count === 0) {
      recommendations.push('Add at least one H2 heading');
    }
    
    if (contentStats.imageCount === 0) {
      recommendations.push('Add at least one image');
    }
    
    if (contentStats.linkCount === 0) {
      recommendations.push('Add internal links to other posts');
    }
    
    if (!imagePreview) {
      recommendations.push('Add a featured image');
    }
    
    return recommendations;
  };

  const handleUpdate = async () => {
    if (contentStats.contentSizeKB > 2048) {
      toast.error('Content size exceeds 2MB limit! Cannot update.');
      return;
    }

    if (!writer) {
      toast.error('Please specify the writer name');
      return;
    }

    setIsUpdating(true);
    
    try {
      let imageUrl = post.imageUrl || '';
      
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      // Process editor content to handle images
      let editorContent = editor?.getHTML() || '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorContent, 'text/html');
      const images = doc.querySelectorAll('img');

      images.forEach(img => {
        if (img.src.startsWith('data:')) {
          // Keep base64 images as is
        } else if (img.hasAttribute('data-src')) {
          // Restore original source if needed
          img.src = img.getAttribute('data-src') || '';
        }
      });

      editorContent = doc.body.innerHTML;

      // Update the blog post with all SEO fields
      const response = await fetch(`/api/blog/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: title.trim(),
          content: editorContent,
          slug: slug.trim(),
          imageUrl: removeImage ? '' : imageUrl,
          excerpt,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          focusKeyword,
          writer,
          linkedinUrl,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      toast.success('Blog post updated successfully!');
      setTimeout(() => router.push('/admin/blog'), 2000);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Blog Post</h1>

        {/* Real-time Content Stats */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          <div className="text-center border-r pr-4">
            <div className="font-semibold">Title</div>
            <div className={`text-lg ${contentStats.titleLength > 60 ? 'text-red-500' : 'text-green-500'}`}>
              {contentStats.titleLength}/60
            </div>
          </div>
          <div className="text-center border-r pr-4">
            <div className="font-semibold">Meta Desc</div>
            <div className={`text-lg ${contentStats.metaDescLength > 160 ? 'text-red-500' : 'text-green-500'}`}>
              {contentStats.metaDescLength}/160
            </div>
          </div>
          <div className="text-center border-r pr-4">
            <div className="font-semibold">Words</div>
            <div className="text-lg">
              {contentStats.contentWords}
              <span className="block text-xs">{contentStats.contentWords < 300 ? 'Add more content' : 'Good length'}</span>
            </div>
          </div>
          <div className="text-center border-r pr-4">
            <div className="font-semibold">Images</div>
            <div className="text-lg">
              {contentStats.imageCount}
              <span className="block text-xs">{contentStats.imageCount === 0 ? 'Add images' : 'Good'}</span>
            </div>
          </div>
          <div className="text-center border-r pr-4">
            <div className="font-semibold">Headings</div>
            <div className="text-lg">
              H2: {contentStats.h2Count}, H3: {contentStats.h3Count}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Size</div>
            <div className={`text-lg ${contentStats.contentSizeKB > 2048 ? 'text-red-500' : 'text-green-500'}`}>
              {(contentStats.contentSizeKB / 1024).toFixed(2)}MB
            </div>
          </div>
        </div>

        {/* SEO Score and Recommendations */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">SEO Score: {seoScore}/100</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 max-w-md">
              <div 
                className={`h-4 rounded-full ${
                  seoScore >= 80 ? 'bg-green-500' :
                  seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${seoScore}%` }}
              ></div>
            </div>
          </div>
          
          {seoScore < 80 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Recommendations:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {getSeoRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={70}
                />
                {focusKeyword && !title.toLowerCase().includes(focusKeyword.toLowerCase()) && (
                  <p className="text-xs text-red-500 mt-1">Consider including your focus keyword in the title</p>
                )}
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Writer and LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Writer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Editor Content */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Editor toolbar buttons */}
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Underline
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Numbered List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    className={`px-3 py-1 rounded ${editor?.isActive('code') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={setLink}
                    className={`px-3 py-1 rounded ${editor?.isActive('link') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={`px-3 py-1 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={`px-3 py-1 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={`px-3 py-1 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Right
                  </button>
                  <div className="relative inline-block">
                    <select
                      onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                      className="px-3 py-1 rounded bg-gray-200 appearance-none"
                      value={editor?.getAttributes('textStyle').color || ''}
                    >
                      <option value="">Text Color</option>
                      <option value="#000000">Black</option>
                      <option value="#ffffff" className="bg-black">White</option>
                      <option value="#ff0000" className="bg-red-500">Red</option>
                      <option value="#00ff00" className="bg-green-500">Green</option>
                      <option value="#0000ff" className="bg-blue-500">Blue</option>
                      <option value="#ffff00" className="bg-yellow-500">Yellow</option>
                      <option value="#ff00ff" className="bg-purple-500">Purple</option>
                    </select>
                  </div>
                  <div className="relative inline-block">
                    <select
                      onChange={(e) => editor?.chain().focus().setHighlight({ color: e.target.value }).run()}
                      className="px-3 py-1 rounded bg-gray-200 appearance-none"
                      value={editor?.getAttributes('highlight').color || ''}
                    >
                      <option value="">Highlight</option>
                      <option value="#ffc078" className="bg-[#ffc078]">Orange</option>
                      <option value="#8ce99a" className="bg-[#8ce99a]">Green</option>
                      <option value="#74c0fc" className="bg-[#74c0fc]">Blue</option>
                      <option value="#b197fc" className="bg-[#b197fc]">Purple</option>
                      <option value="#ffa8a8" className="bg-[#ffa8a8]">Red</option>
                      <option value="#ffe066" className="bg-[#ffe066]">Yellow</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => editorImageInputRef.current?.click()}
                    className="px-3 py-1 rounded bg-gray-200"
                  >
                    Insert Image
                  </button>
                  <input
                    type="file"
                    ref={editorImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={addDeviceImageToEditor}
                  />
                </div>
                <div className="border p-3 rounded min-h-[200px] prose max-w-none">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Featured Image Upload */}
              <div className="mb-4 p-4 border rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">Featured Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mb-2 transition w-full"
                >
                  {imagePreview ? 'Change Image' : 'Select Image'}
                </button>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt={title || "Post image"} 
                      className="w-full h-auto object-contain rounded border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 text-sm mt-1 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                {!imagePreview && (
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x630px (for social sharing)
                  </p>
                )}
              </div>

              {/* SEO Fields */}
              <div className="mb-4 p-4 border rounded-lg bg-blue-50">
                <h3 className="font-bold text-lg mb-3 text-blue-800">SEO Settings</h3>
                
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">Focus Keyword</label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="main keyword for this post"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    maxLength={70}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    maxLength={170}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    maxLength={170}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="comma, separated, keywords"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={handleUpdate}
                disabled={isUpdating || contentStats.contentSizeKB > 2048}
                className={`w-full px-4 py-3 rounded-lg text-white font-bold ${
                  isUpdating ? 'bg-blue-400' : 
                  contentStats.contentSizeKB > 2048 ? 'bg-red-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
              >
                {isUpdating ? 'Updating...' : 
                 contentStats.contentSizeKB > 2048 ? 'Content too large (2MB max)' : 'Update Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  
  const { id } = context.params!;

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return { notFound: true };
    }

    const blog = await BlogPost.findById(id).lean<BlogPostLean>();
    
    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        post: {
          _id: blog._id.toString(),
          title: blog.title,
          content: blog.content,
          slug: blog.slug,
          imageUrl: blog.imageUrl || null,
          excerpt: blog.excerpt || null,
          metaTitle: blog.metaTitle || null,
          metaDescription: blog.metaDescription || null,
          keywords: blog.keywords || [],
          focusKeyword: blog.focusKeyword || null,
          writer: blog.writer || null,
          linkedinUrl: blog.linkedinUrl || null,
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
};