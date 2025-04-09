import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
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

export default function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize editor with all extensions
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
    content: '',
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
  });

  // Calculate SEO score based on content
  useEffect(() => {
    let score = 0;
    
    // Title check (should contain focus keyword and be 50-60 chars)
    if (title.length >= 50 && title.length <= 60) score += 20;
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    
    // Content length check (at least 300 words)
    const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length || 0;
    if (wordCount >= 300) score += 15;
    
    // Meta description check (should be 120-160 chars)
    const desc = metaDescription || excerpt;
    if (desc.length >= 120 && desc.length <= 160) score += 15;
    
    // Image check
    if (imagePreview) score += 10;
    
    // Headings check (should have at least one H2)
    const hasH2 = editor?.getHTML().includes('<h2') || false;
    if (hasH2) score += 10;
    
    // Internal links check
    const hasLinks = editor?.getHTML().includes('<a ') || false;
    if (hasLinks) score += 5;
    
    // Keywords in content
    if (focusKeyword && editor?.getText().toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 10;
    }
    
    setSeoScore(Math.min(100, score));
  }, [title, excerpt, metaDescription, focusKeyword, editor, imagePreview]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-'));
    
    // Auto-generate meta title if empty
    if (!metaTitle) {
      setMetaTitle(newTitle.length > 60 ? newTitle.substring(0, 57) + '...' : newTitle);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = '';

      // Upload featured image if exists
      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Image upload failed');
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      // Process editor content
      let editorContent = editor?.getHTML() || '';
      
      // Create the blog post with all SEO fields
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content: editorContent,
          imageUrl,
          excerpt,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          focusKeyword,
        }),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Blog Post</h1>
        
        {/* SEO Score Indicator */}
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
          <div className="text-sm text-gray-600">
            {seoScore >= 80 ? 'Excellent! Your post is well optimized for SEO.' :
             seoScore >= 50 ? 'Good, but could be improved.' : 
             'Needs improvement for better search visibility.'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    {title.length}/60 recommended characters
                  </span>
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
                {focusKeyword && !slug.includes(focusKeyword.toLowerCase()) && (
                  <p className="text-xs text-red-500 mt-1">Consider including your focus keyword in the slug</p>
                )}
              </div>

              {/* Editor Content */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Text formatting */}
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
                  
                  {/* Headings */}
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
                  
                  {/* Lists */}
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
                  
                  {/* Block elements */}
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
                  
                  {/* Links */}
                  <button
                    type="button"
                    onClick={setLink}
                    className={`px-3 py-1 rounded ${editor?.isActive('link') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Link
                  </button>
                  
                  {/* Text alignment */}
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
                  
                  {/* Colors */}
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
                  
                  {/* Image */}
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
                  {image ? 'Change Image' : 'Select Image'}
                </button>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-auto object-contain rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
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
                
                {/* Focus Keyword */}
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

                {/* Meta Title */}
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Meta Title
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      {metaTitle.length}/60 recommended
                    </span>
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    maxLength={70}
                  />
                  {focusKeyword && !metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()) && (
                    <p className="text-xs text-red-500 mt-1">Include focus keyword</p>
                  )}
                </div>

                {/* Meta Description */}
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Meta Description
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      {metaDescription.length}/160 recommended
                    </span>
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    maxLength={170}
                  />
                  {focusKeyword && !metaDescription.toLowerCase().includes(focusKeyword.toLowerCase()) && (
                    <p className="text-xs text-red-500 mt-1">Consider including focus keyword</p>
                  )}
                </div>

                {/* Excerpt */}
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Excerpt
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      {excerpt.length}/160 recommended
                    </span>
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    maxLength={170}
                  />
                </div>

                {/* Keywords */}
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

              {/* Publish Button */}
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full px-4 py-3 rounded-lg text-white font-bold ${
                  isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
              >
                {isUploading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
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

  return {
    props: {},
  };
};