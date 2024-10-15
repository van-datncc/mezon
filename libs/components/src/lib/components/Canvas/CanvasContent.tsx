import { canvasActions } from '@mezon/store';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface TextEntry {
    text: string;
    format: { [key: string]: unknown }; // Kiểu cho định dạng
}

function CanvasContent({ isLightMode, content }: { isLightMode: boolean; content: string }) {
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [texts, setTexts] = useState<TextEntry[]>([]);
    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();

    console.log(content, 'content');

    useEffect(() => {
        // Khởi tạo Quill
        quillRef.current = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: false // Tắt toolbar mặc định của Quill
            }
        });

        const handleSelectionChange = (range: any) => {
            // Hiện toolbar khi có văn bản được chọn
            setToolbarVisible(!!(range && range.length > 0));
        };

        // Hàm lưu văn bản và định dạng
        const saveText = () => {
            const selection = quillRef.current?.getSelection();
            if (selection && selection.length > 0) {
                const text = quillRef.current?.getText(selection.index, selection.length).trim();
                const format = quillRef.current?.getFormat(selection.index, selection.length) || {};

                // Chỉ lưu nếu có văn bản và đã chọn định dạng
                if (text && Object.keys(format).length > 0) {
                    setTexts((prevTexts) => [
                        ...prevTexts,
                        { text, format } // Lưu text và format
                    ]);
                    console.log('Lưu text:', text, 'với định dạng:', format);

                    // Xóa văn bản trong editor sau khi lưu
                    quillRef.current?.setText('');
                    setToolbarVisible(false); // Ẩn toolbar
                }
            }
        };

        // Hàm để định dạng văn bản trong Quill
        const formatText = (format: string) => {
            if (quillRef.current) {
                const currentFormat = quillRef.current.getFormat(); // Lấy định dạng hiện tại
                const isActive = !!currentFormat[format]; // Kiểm tra xem định dạng hiện tại có đang hoạt động không
                quillRef.current.format(format, !isActive); // Chuyển đổi định dạng
            }
        };

        // Lắng nghe sự kiện nhấn phím Enter
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
                saveText();
            }
        };

        // Lắng nghe sự kiện click ra ngoài editor
        const handleClickOutside = (event: MouseEvent) => {
            if (
                editorRef.current &&
                toolbarRef.current &&
                !editorRef.current.contains(event.target as Node) &&
                !toolbarRef.current.contains(event.target as Node)
            ) {
                saveText();
            }
        };

        // Gắn các sự kiện
        quillRef.current.on('selection-change', handleSelectionChange);
        quillRef.current.root.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            quillRef.current?.off('selection-change', handleSelectionChange);
            quillRef.current?.root.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getQuillContent = () => {
        if (quillRef.current) {
            const delta = quillRef.current.getContents(); // Lấy nội dung với định dạng Delta
            const content = JSON.stringify(delta);
            debugger
            dispatch(canvasActions.setContent(content || ''));
        }
        return null;
    };

    const sendContentToAPI = async () => {
        const content = getQuillContent();
        if (content) {
            try {
                const response = await fetch('URL_API_CỦA_BẠN', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(content),
                });

                if (!response.ok) {
                    throw new Error('Lỗi khi gửi dữ liệu');
                }

                const responseData = await response.json();
                console.log('Dữ liệu đã được gửi thành công:', responseData);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        } else {
            console.error('Không lấy được nội dung từ Quill');
        }
    };

    // Định nghĩa hàm formatText
    const formatText = (format: string) => {
        if (quillRef.current) {
            const currentFormat = quillRef.current.getFormat();
            const isActive = !!currentFormat[format];
            quillRef.current.format(format, !isActive);
        }
    };

    return (
        <div className="note-canvas" style={{ position: 'relative' }}>
            {/* <div className="text-list">
                {texts.map((item, index) => (
                    <div key={index} style={{ whiteSpace: 'pre-wrap' }}>
                        <span
                            style={{
                                fontWeight: item.format.bold ? 'bold' : 'normal',
                                fontStyle: item.format.italic ? 'italic' : 'normal',
                                textDecoration: item.format.strike ? 'line-through' : 'none',
                                textDecorationLine: item.format.underline ? 'underline' : 'none'
                            }}
                        >
                            {item.text}
                        </span>
                    </div>
                ))}
            </div> */}
            {toolbarVisible && (
                <div
                    ref={toolbarRef}
                    className="toolbar"
                    style={{
                        position: 'absolute',
                        top: '-10px', // Điều chỉnh vị trí của toolbar nếu cần
                        left: '0',
                        padding: '0 10px',
                        display: 'flex',
                        gap: '10px',
                        background: isLightMode ? 'white' : 'black',
                        color: isLightMode ? 'black' : 'white',
                        borderRadius: '5px'
                    }}
                >
                    <button onClick={() => formatText('bold')}>Bold</button>
                    <button onClick={() => formatText('italic')}>Italic</button>
                    <button onClick={() => formatText('underline')}>Underline</button>
                    <button onClick={() => formatText('strike')}>Strike</button>
                </div>
            )}
            <div id="editor" ref={editorRef} style={{ height: '100px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <button onClick={sendContentToAPI}>Gửi nội dung</button>
        </div>
    );
}

export default CanvasContent;