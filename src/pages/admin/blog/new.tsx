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

// Transition words list
const TRANSITION_WORDS = [
  // Single words
  'however', 'therefore', 'moreover', 'furthermore', 'consequently', 
  'nevertheless', 'otherwise', 'meanwhile', 'nonetheless', 'similarly',
  'additionally', 'hence', 'thus', 'accordingly', 'indeed', 'subsequently',
  'conversely', 'likewise', 'thereby', 'ultimately', 'instead', 'rather',
  'regardless', 'although', 'despite', 'finally', 'albeit', 'also', 'afterward',
  'afterwards', 'basically', 'because', 'before', 'besides', 'but', 'certainly',
  'chiefly', 'comparatively', 'concurrently', 'contrarily', 'correspondingly',
  'doubtedly', 'during', 'e.g.', 'earlier', 'emphatically', 'equally', 'especially',
  'eventually', 'evidently', 'explicitly', 'firstly', 'following', 'formerly',
  'forthwith', 'fourthly', 'further', 'generally', 'henceforth', 'i.e.', 'identically',
  'lastly', 'later', 'lest', 'likewise', 'markedly', 'meanwhile', 'nevertheless',
  'nor', 'notwithstanding', 'obviously', 'occasionally', 'once', 'overall', 'particularly',
  'presently', 'previously', 'rather', 'secondly', 'shortly', 'significantly', 'similarly',
  'simultaneously', 'since', 'so', 'soon', 'specifically', 'still', 'straightaway',
  'surely', 'surprisingly', 'than', 'then', 'thereafter', 'therefore', 'thereupon',
  'thirdly', 'though', 'thus', 'till', 'undeniably', 'undoubtedly', 'unless', 'unlike',
  'unquestionably', 'until', 'when', 'whenever', 'whereas', 'while',
  
  // Multiple words
  'in conclusion', 'in summary', 'to summarize', 'as a result', 'for instance',
  'for example', 'in particular', 'specifically', 'in addition', 'on the other hand',
  'in contrast', 'by comparison', 'that is', 'to illustrate', 'to clarify', 'above all',
  'after all', 'after that', 'all in all', 'all of a sudden', 'all things considered',
  'although this may be true', 'another key point', 'as a matter of fact', 'as a result',
  'as an illustration', 'as can be seen', 'as has been noted', 'as I have noted',
  'as I have said', 'as I have shown', 'as long as', 'as much as', 'as shown above',
  'as soon as', 'as well as', 'at any rate', 'at first', 'at last', 'at least',
  'at length', 'at the present time', 'at the same time', 'at this instant',
  'at this point', 'at this time', 'balanced against', 'being that', 'by all means',
  'by and large', 'by comparison', 'by the same token', 'by the time', 'be that as it may',
  'coupled with', 'different from', 'due to', 'equally important', 'even if', 'even more',
  'even so', 'even though', 'first thing to remember', 'for fear that', 'for one thing',
  'for that reason', 'for the most part', 'for the purpose of', 'for the same reason',
  'for this purpose', 'for this reason', 'from time to time', 'given that',
  'given these points', 'important to realize', 'in a word', 'in another case',
  'in any case', 'in any event', 'in brief', 'in case', 'in detail', 'in due time',
  'in effect', 'in either case', 'in essence', 'in fact', 'in general', 'in light of',
  'in like fashion', 'in like manner', 'in order that', 'in order to', 'in other words',
  'in particular', 'in reality', 'in short', 'in similar fashion', 'in spite of',
  'in sum', 'in that case', 'in the event that', 'in the final analysis',
  'in the first place', 'in the fourth place', 'in the hope that', 'in the light of',
  'in the long run', 'in the meantime', 'in the same fashion', 'in the same way',
  'in the second place', 'in the third place', 'in this case', 'in this situation',
  'in time', 'in truth', 'in view of', 'most compelling evidence', 'most important',
  'must be remembered', 'not to mention', 'now that', 'of course', 'on account of',
  'on balance', 'on condition that', 'on one hand', 'on the condition that',
  'on the contrary', 'on the negative side', 'on the other hand', 'on the positive side',
  'on the whole', 'on this occasion', 'only if', 'owing to', 'point often overlooked',
  'prior to', 'provided that', 'seeing that', 'so as to', 'so far', 'so long as',
  'so that', 'sooner or later', 'such as', 'summing up', 'take the case of',
  'that is to say', 'then again', 'this time', 'to be sure', 'to begin with',
  'to demonstrate', 'to emphasize', 'to enumerate', 'to explain', 'to list',
  'to point out', 'to put it another way', 'to put it differently', 'to repeat',
  'to rephrase it', 'to say nothing of', 'to that end', 'to the end that',
  'to this end', 'together with', 'under those circumstances', 'until now',
  'up against', 'up to the present time', 'vis a vis', 'what\'s more',
  'while it may be true', 'while this may be true', 'with attention to',
  'with the result that', 'with this in mind', 'with this intention',
  'with this purpose in mind', 'without a doubt', 'without delay',
  'without doubt', 'without reservation',
  
  // Two-part transitions (stored as single strings)
  'both … and', 'if … then', 'not only … but also', 'neither … nor',
  'whether … or', 'no sooner … than'
];

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
  const [transitionWordCount, setTransitionWordCount] = useState(0);
  const [longParagraphErrors, setLongParagraphErrors] = useState<string[]>([]);

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
    onUpdate: ({ editor }) => {
      updateContentStats();
      checkContentQuality(editor.getHTML());
    },
  });

  const updateContentStats = () => {
    const content = editor?.getHTML() || '';
    const textContent = editor?.getText() || '';
    const contentSizeBytes = new Blob([content]).size;
    const contentSizeKB = Math.round(contentSizeBytes / 1024);

    return {
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
    };
  };

  const checkContentQuality = (htmlContent: string) => {
    // Check for transition words
    const textContent = editor?.getText() || '';
    const words = textContent.toLowerCase().split(/\s+/);
    const transitionCount = words.filter(word => 
      TRANSITION_WORDS.includes(word.toLowerCase())
    ).length;
    setTransitionWordCount(transitionCount);

    // Check for long paragraphs without headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const newErrors: string[] = [];
    let wordCountSinceLastHeading = 0;

    doc.body.childNodes.forEach((node) => {
      if (node.nodeName === 'H2' || node.nodeName === 'H3') {
        wordCountSinceLastHeading = 0;
      } else if (node.nodeName === 'P') {
        const text = node.textContent || '';
        const wordCount = text.split(/\s+/).length;
        wordCountSinceLastHeading += wordCount;
        
        if (wordCountSinceLastHeading > 300) {
          newErrors.push(`Section exceeds 300 words without heading. Add H2/H3 after ~300 words.`);
        }
        
        if (wordCount > 150) {
          newErrors.push(`Paragraph too long (${wordCount} words). Consider breaking it up.`);
        }
      }
    });

    setLongParagraphErrors(newErrors);
  };

  useEffect(() => {
    if (editor) {
      checkContentQuality(editor.getHTML());
    }
  }, [editor]);

  useEffect(() => {
    const stats = updateContentStats();
    let score = 0;
    if (title.length >= 50 && title.length <= 60) score += 20;
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    if (stats.contentWords >= 300) score += 15;
    if ((metaDescription || excerpt).length >= 120 && (metaDescription || excerpt).length <= 160) score += 15;
    if (imagePreview) score += 10;
    if (stats.h2Count > 0) score += 10;
    if (stats.linkCount > 0) score += 5;
    if (stats.tableCount > 0) score += 5;
    if (focusKeyword && editor?.getText().toLowerCase().includes(focusKeyword.toLowerCase())) score += 10;
    if (writer) score += 5;
    if (transitionWordCount >= 5) score += 5;
    setSeoScore(Math.min(100, score));
  }, [title, excerpt, metaDescription, focusKeyword, imagePreview, editor, writer, transitionWordCount]);

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
    
    const stats = updateContentStats();
    if (stats.contentSizeKB > 2048) {
      toast.error('Content size exceeds 2MB limit! Cannot publish.');
      return;
    }

    if (!writer) {
      toast.error('Please specify the writer name');
      return;
    }

    if (longParagraphErrors.length > 0) {
      toast.warning('Please fix the content structure issues before publishing');
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
    const stats = updateContentStats();
    const recommendations = [];
    if (title.length < 50 || title.length > 60) recommendations.push('Title should be 50-60 characters');
    if (!focusKeyword) recommendations.push('Add a focus keyword for better SEO');
    else {
      if (!title.toLowerCase().includes(focusKeyword.toLowerCase())) recommendations.push('Include focus keyword in title');
      if (!slug.includes(focusKeyword.toLowerCase())) recommendations.push('Include focus keyword in slug');
    }
    if (stats.contentWords < 300) recommendations.push('Content should be at least 300 words');
    if (stats.h2Count === 0) recommendations.push('Add at least one H2 heading');
    if (stats.imageCount === 0) recommendations.push('Add at least one image');
    if (stats.linkCount === 0) recommendations.push('Add internal links to other posts');
    if (!imagePreview) recommendations.push('Add a featured image');
    if (transitionWordCount < 5) recommendations.push(`Add more transition words (current: ${transitionWordCount})`);
    if (longParagraphErrors.length > 0) {
      recommendations.push(...longParagraphErrors);
    }
    return recommendations;
  };

  const stats = updateContentStats();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 py-8">
        <ToastContainer position="top-right" autoClose={5000} />
        
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Create New Blog Post</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
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

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  
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

                  <div className="border rounded overflow-hidden">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isUploading || stats.contentSizeKB > 2048}
                  className={`w-full px-4 py-3 rounded-lg text-white font-bold ${
                    isUploading ? 'bg-blue-400' : 
                    stats.contentSizeKB > 2048 ? 'bg-red-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition`}
                >
                  {isUploading ? 'Publishing...' : 
                  stats.contentSizeKB > 2048 ? 'Content too large (2MB max)' : 'Publish Post'}
                </button>
              </div>
            </div>
          </form>

          <div className="mb-6 mt-6 bg-white p-4 rounded-lg shadow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 text-sm">
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Title</div>
              <div className={`text-lg ${stats.titleLength > 60 ? 'text-red-500' : 'text-green-500'}`}>
                {stats.titleLength}/60
              </div>
            </div>
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Meta Desc</div>
              <div className={`text-lg ${stats.metaDescLength > 160 ? 'text-red-500' : 'text-green-500'}`}>
                {stats.metaDescLength}/160
              </div>
            </div>
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Words</div>
              <div className="text-lg">
                {stats.contentWords}
                <span className="block text-xs">{stats.contentWords < 300 ? 'Add more content' : 'Good length'}</span>
              </div>
            </div>
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Transitions</div>
              <div className={`text-lg ${transitionWordCount < 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                {transitionWordCount}
                <span className="block text-xs">{transitionWordCount < 5 ? 'Add more' : 'Good'}</span>
              </div>
            </div>
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Images</div>
              <div className="text-lg">
                {stats.imageCount}
                <span className="block text-xs">{stats.imageCount === 0 ? 'Add images' : 'Good'}</span>
              </div>
            </div>
            <div className="text-center border-r pr-4">
              <div className="font-semibold">Headings</div>
              <div className="text-lg">
                H2: {stats.h2Count}, H3: {stats.h3Count}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Size</div>
              <div className={`text-lg ${stats.contentSizeKB > 2048 ? 'text-red-500' : 'text-green-500'}`}>
                {(stats.contentSizeKB / 1024).toFixed(2)}MB
              </div>
            </div>
          </div>

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
            
            {longParagraphErrors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                <h3 className="font-semibold mb-2 text-red-700">Content Structure Issues:</h3>
                <ul className="list-disc pl-5 text-sm text-red-700">
                  {longParagraphErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {seoScore < 80 && ( 
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Recommendations:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {getSeoRecommendations().filter(rec => !longParagraphErrors.includes(rec)).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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