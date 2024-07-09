import React, { useState, useRef } from "react"
import { Bold, Italic, Underline, List, Code, Tag, Heading1, Heading2, Heading3 } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const BlockTypes = {
  PARAGRAPH: "paragraph",
  HEADING1: "heading1",
  HEADING2: "heading2",
  HEADING3: "heading3",
  CODE: "code",
  ORDERED_LIST: "orderedList",
  UNORDERED_LIST: "unorderedList"
}

const Block = ({ id, content, type, moveBlock, index }) => {
  const ref = useRef(null)

  const [, drop] = useDrop({
    accept: "block",
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveBlock(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: { id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  const renderContent = () => {
    switch (type) {
      case BlockTypes.HEADING1:
        return <h1 className="text-2xl font-bold">{content}</h1>
      case BlockTypes.HEADING2:
        return <h2 className="text-xl font-bold">{content}</h2>
      case BlockTypes.HEADING3:
        return <h3 className="text-lg font-bold">{content}</h3>
      case BlockTypes.CODE:
        return (
          <pre className="bg-gray-100 p-2 rounded">
            <code>{content}</code>
          </pre>
        )
      case BlockTypes.ORDERED_LIST:
        return (
          <ol className="list-decimal list-inside">
            <li>{content}</li>
          </ol>
        )
      case BlockTypes.UNORDERED_LIST:
        return (
          <ul className="list-disc list-inside">
            <li>{content}</li>
          </ul>
        )
      default:
        return <p>{content}</p>
    }
  }

  return (
    <div ref={ref} className={`mb-2 ${isDragging ? "opacity-50" : ""}`}>
      {renderContent()}
    </div>
  )
}

const NotionLikeEditor = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, content: "Welcome to your Notion-like editor!", type: BlockTypes.PARAGRAPH }
  ])
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")

  const addBlock = type => {
    const newBlock = {
      id: Date.now(),
      content: "",
      type
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id, content) => {
    setBlocks(blocks.map(block => (block.id === id ? { ...block, content } : block)))
  }

  const moveBlock = (dragIndex, hoverIndex) => {
    const draggedBlock = blocks[dragIndex]
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks]
      newBlocks.splice(dragIndex, 1)
      newBlocks.splice(hoverIndex, 0, draggedBlock)
      return newBlocks
    })
  }

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleContentChange = e => {
    setContent(e.target.value)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => addBlock(BlockTypes.PARAGRAPH)} className="p-2 border rounded">
            <Bold size={20} />
          </button>
          <button onClick={() => addBlock(BlockTypes.HEADING1)} className="p-2 border rounded">
            <Heading1 size={20} />
          </button>
          <button onClick={() => addBlock(BlockTypes.HEADING2)} className="p-2 border rounded">
            <Heading2 size={20} />
          </button>
          <button onClick={() => addBlock(BlockTypes.HEADING3)} className="p-2 border rounded">
            <Heading3 size={20} />
          </button>
          <button onClick={() => addBlock(BlockTypes.CODE)} className="p-2 border rounded">
            <Code size={20} />
          </button>
          <button onClick={() => addBlock(BlockTypes.ORDERED_LIST)} className="p-2 border rounded">
            OL
          </button>
          <button onClick={() => addBlock(BlockTypes.UNORDERED_LIST)} className="p-2 border rounded">
            <List size={20} />
          </button>
        </div>
        <div className="mb-4 text-grey-400">
          <input
            type="text"
            value={currentTag}
            onChange={e => setCurrentTag(e.target.value)}
            className="border p-2 mr-2 text-black"
            placeholder="Enter a tag"
          />
          <button onClick={addTag} className="p-2 border rounded text-white">
            <Tag size={20} />
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div
          className="border p-4 min-h-[600px]"
          contentEditable={true}
          onInput={handleContentChange}
          // dangerouslySetInnerHTML={{ __html: content }}
        >
          {blocks.map((block, index) => (
            <Block
              key={block.id}
              id={block.id}
              content={block.content}
              type={block.type}
              moveBlock={moveBlock}
              index={index}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

export default NotionLikeEditor
