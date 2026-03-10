import { useState, useEffect, useMemo } from 'react'
import { words, Word } from './data'
import './App.css'

function App() {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterValue, setFilterValue] = useState<string>('all')
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [showMeaning, setShowMeaning] = useState(false)

  // Get unique parts and grades for filters
  const parts = useMemo(() => Array.from(new Set(words.map(w => w.parts))).sort(), [])
  const grades = useMemo(() => Array.from(new Set(words.map(w => w.grade))).sort(), [])

  const filteredWords = useMemo(() => {
    if (filterType === 'all') return words
    if (filterType === 'parts') return words.filter(w => w.parts === filterValue)
    if (filterType === 'grade') return words.filter(w => w.grade === filterValue)
    return words
  }, [filterType, filterValue])

  const totalFiltered = filteredWords.length

  const getRandomWord = () => {
    if (filteredWords.length === 0) {
      setCurrentWord(null)
      return
    }
    const randomIndex = Math.floor(Math.random() * filteredWords.length)
    setCurrentWord(filteredWords[randomIndex])
    setShowMeaning(false)
  }

  // Effect to reset word when filter changes
  useEffect(() => {
    getRandomWord()
  }, [filterType, filterValue])

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value
    setFilterType(type)
    if (type === 'all') setFilterValue('all')
    else if (type === 'parts') setFilterValue(parts[0])
    else if (type === 'grade') setFilterValue(grades[0])
  }

  return (
    <div className="container">
      <header className="header">
        <h1>英単語 アプリ</h1>
      </header>

      <main className="content">
        <div className="controls">
          <div className="filter-group">
            <label>種類：</label>
            <select value={filterType} onChange={handleFilterTypeChange}>
              <option value="all">すべて (完全ランダム)</option>
              <option value="parts">品詞別</option>
              <option value="grade">学年別</option>
            </select>
          </div>

          {filterType !== 'all' && (
            <div className="filter-group">
              <label>{filterType === 'parts' ? '品詞：' : '学年：'}</label>
              <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                {filterType === 'parts' 
                  ? parts.map(p => <option key={p} value={p}>{p}</option>)
                  : grades.map(g => <option key={g} value={g}>{g}</option>)
                }
              </select>
            </div>
          )}
        </div>

        {currentWord ? (
          <div className="card">
            <div className="id-badge">
              ID: {currentWord.id} / Total: {totalFiltered}
            </div>
            
            <div className="word-display">
              <div className="english">{currentWord.e_word}</div>
              
              <div className="meaning-container">
                {showMeaning ? (
                  <div className="meaning">{currentWord.mean}</div>
                ) : (
                  <button className="btn-meaning" onClick={() => setShowMeaning(true)}>
                    意味を表示
                  </button>
                )}
              </div>
            </div>

            <button className="btn-next" onClick={getRandomWord}>
              次の単語
            </button>
          </div>
        ) : (
          <div className="no-data">該当する単語がありません</div>
        )}
      </main>
    </div>
  )
}

export default App
