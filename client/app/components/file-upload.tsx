'use client';
import * as React from 'react';
import { Upload } from 'lucide-react';

const FileUploadComponent: React.FC = () => {

const HUBC = () => {
  const el = document.createElement('input');
  el.type = 'file';
  el.accept = 'application/pdf';

  el.addEventListener('change', async () => {
    if (el.files && el.files.length > 0) {
      const file = el.files[0];

      const formdata = new FormData();
      formdata.append('pdf', file);

      try {
        const res = await fetch('http://localhost:8000/upload/pdf', {
          method: 'POST',
          body: formdata
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
        console.log('File uploaded');
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  });

  el.click();
};

return (
  <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2">
    <div
      onClick={HUBC}
      className="flex justify-center items-center flex-col"
    >
      <h3>Upload PDF File</h3>
      <Upload />
    </div>
  </div>
  );
};

export default FileUploadComponent;