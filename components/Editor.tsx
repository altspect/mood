'use client'

import { useState } from 'react';
import { useAutosave } from 'react-autosave';
import { updateEntry } from '@/utils/api';

const Editor = ({ entry }) => {
  const [value, setValue] = useState<string>(entry.content);
  const [isLoading, setIsLoading] = useState(false);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const updated = await updateEntry(entry.id, _value);
      setIsLoading(false);
    }
  })

  return <div className="w-full h-full">
    <textarea className="w-full h-full p-8 text-xl" value={value} onChange={e => setValue(e.target.value)} />
  </div>
}

export default Editor;
