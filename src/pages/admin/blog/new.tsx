import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '@/components/AdminLayout';

export default function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [writer, setWriter] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [contentStats, setContentStats] = useState({
    titleLength: 0,
    excerptLength: 0,
    metaDescLength: 0,
    contentWords: 0,
    contentSizeKB: 0,
    imageCount: 0,
    h2Count: 0,
    h3Count: 0,
    linkCount: 0,
    tableCount: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-400 w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100',
        },
      }),
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: () => updateContentStats(),
  });

  const updateContentStats = () => {
    const content = editor?.getHTML() || '';
    const textContent = editor?.getText() || '';
    const contentSizeBytes = new Blob([content]).size;
    const contentSizeKB = Math.round(contentSizeBytes / 1024);

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
      tableCount: (content.match(/<table/g) || []).length,
    });
  };

  useEffect(() => {
    updateContentStats();
  }, [title, excerpt, metaDescription, editor]);

  useEffect(() => {
    let score = 0;
    if (title.length >= 50 && title.length <= 60) score += 20;
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    if (contentStats.contentWords >= 300) score += 15;
    if ((metaDescription || excerpt).length >= 120 && (metaDescription || excerpt).length <= 160) score += 15;
    if (imagePreview) score += 10;
    if (contentStats.h2Count > 0) score += 10;
    if (contentStats.linkCount > 0) score += 5;
    if (contentStats.tableCount > 0) score += 5;
    if (focusKeyword && editor?.getText().toLowerCase().includes(focusKeyword.toLowerCase())) score += 10;
    if (writer) score += 5;
    setSeoScore(Math.min(100, score));
  }, [title, excerpt, metaDescription, focusKeyword, imagePreview, contentStats, writer]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-'));
    if (!metaTitle) setMetaTitle(newTitle.length > 60 ? newTitle.substring(0, 57) + '...' : newTitle);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size exceeds 2MB limit!');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const { imageUrl } = await response.json();
      setImagePreview(imageUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const addDeviceImageToEditor = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size exceeds 2MB limit!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      editor?.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  const addTable = () => {
    editor?.chain().focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run();
  };

  const addColumn = () => {
    editor?.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run();
  };

  const addRow = () => {
    editor?.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run();
  };

  const toggleHeaderCell = () => {
    editor?.chain().focus().toggleHeaderCell().run();
  };

  const mergeCells = () => {
    editor?.chain().focus().mergeCells().run();
  };

  const splitCell = () => {
    editor?.chain().focus().splitCell().run();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contentStats.contentSizeKB > 2048) {
      toast.error('Content size exceeds 2MB limit! Cannot publish.');
      return;
    }

    if (!writer) {
      toast.error('Please specify the writer name');
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content: editor?.getHTML() || '',
          imageUrl: imagePreview || undefined,
          excerpt,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          focusKeyword,
          writer,
          linkedinUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      toast.success('Blog post published successfully!');
      setTimeout(() => router.push('/admin/blog'), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const getSeoRecommendations = () => {
    const recommendations = [];
    if (title.length < 50 || title.length > 60) recommendations.push('Title should be 50-60 characters');
    if (!focusKeyword) recommendations.push('Add a focus keyword for better SEO');
    else {
      if (!title.toLowerCase().includes(focusKeyword.toLowerCase())) recommendations.push('Include focus keyword in title');
      if (!slug.includes(focusKeyword.toLowerCase())) recommendations.push('Include focus keyword in slug');
    }
    if (contentStats.contentWords < 300) recommendations.push('Content should be at least 300 words');
    if (contentStats.h2Count === 0) recommendations.push('Add at least one H2 heading');
    if (contentStats.imageCount === 0) recommendations.push('Add at least one image');
    if (contentStats.linkCount === 0) recommendations.push('Add internal links to other posts');
    if (!imagePreview) recommendations.push('Add a featured image');
    return recommendations;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 py-8">
        <ToastContainer position="top-right" autoClose={5000} />
        
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Create New Blog Post</h1>

          {/* Content Stats */}
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

          {/* SEO Score */}
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

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
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
                  
                  {/* Sticky Toolbar */}
                  <div className="sticky top-20 z-10 bg-white py-2 border-b">
                    <div className="flex flex-wrap gap-2 mb-2">
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
                      {/* Table Controls */}
                      <button
                        type="button"
                        onClick={addTable}
                        className="px-3 py-1 rounded bg-gray-200"
                      >
                        Add Table
                      </button>
                      {editor?.isActive('table') && (
                        <>
                          <button
                            type="button"
                            onClick={deleteTable}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Delete Table
                          </button>
                          <button
                            type="button"
                            onClick={addColumn}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Add Column
                          </button>
                          <button
                            type="button"
                            onClick={deleteColumn}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Delete Column
                          </button>
                          <button
                            type="button"
                            onClick={addRow}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Add Row
                          </button>
                          <button
                            type="button"
                            onClick={deleteRow}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Delete Row
                          </button>
                          <button
                            type="button"
                            onClick={toggleHeaderCell}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Toggle Header
                          </button>
                          <button
                            type="button"
                            onClick={mergeCells}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Merge Cells
                          </button>
                          <button
                            type="button"
                            onClick={splitCell}
                            className="px-3 py-1 rounded bg-gray-200"
                          >
                            Split Cell
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bubble Menu (appears when text is selected) */}
                  {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <div className="flex gap-1 bg-white p-1 rounded shadow-lg border">
                        <button
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        >
                          Bold
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        >
                          Italic
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        >
                          Underline
                        </button>
                        <button
                          onClick={setLink}
                          className={`p-1 rounded ${editor.isActive('link') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        >
                          Link
                        </button>
                      </div>
                    </BubbleMenu>
                  )}

                  {/* Editor Content */}
                  <div className="border rounded overflow-hidden">
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
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Select Image'}
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
                  disabled={isUploading || contentStats.contentSizeKB > 2048}
                  className={`w-full px-4 py-3 rounded-lg text-white font-bold ${
                    isUploading ? 'bg-blue-400' : 
                    contentStats.contentSizeKB > 2048 ? 'bg-red-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition`}
                >
                  {isUploading ? 'Publishing...' : 
                  contentStats.contentSizeKB > 2048 ? 'Content too large (2MB max)' : 'Publish Post'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}