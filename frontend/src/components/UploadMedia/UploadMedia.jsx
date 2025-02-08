import { useState } from 'react';


const UploadMedia = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
    }))};

  return (
    <div className="container">
        <h1>Upload Media</h1>

        <div className = "form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />

        </div>

        <div className = "form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className = "form-group">
            <label htmlFor="file">File</label>
            <input type="file" className="form-control" id="file" name="file" onChange={handleFile} />
        </div>
        
    </div>
  );
};


export default UploadMedia;