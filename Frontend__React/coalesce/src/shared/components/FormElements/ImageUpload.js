import React, { useRef, useState, useEffect } from 'react';

let initial = true;

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
  }, [file]);

  if (initial) {
    initial = false;
    return;
  }

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      props.onSelect(pickedFile);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload--fp">
        <span className="material-icons-outlined" onClick={pickImageHandler}>
          collections
        </span>
        {file && <span className="material-icons-outlined tick">done</span>}
      </div>
    </div>
  );
};

export default ImageUpload;
