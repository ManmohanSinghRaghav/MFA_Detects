import React, { useState } from 'react';
import Axios from 'axios';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./firebase";
import './StudentForm.css';
const URL1 = process.env.REACT_APP_SERVER_URL;
const URL="https://mern-attendance-app-api.onrender.com"
const StudentFormPage = () => {
    const [insertStudent, setInsertStudent] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    Register_number: '',
    Year_of_studying: '',
    Branch_of_studying: '',
    Date_of_Birth: '',
    Gender: '',
    Community: '',
    Minority_Community: '',
    Blood_Group: '',
    Aadhar_number: '',
    Mobile_number: '',
    Email_id: '',
  });
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${formData.Register_number}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${URL}/form/insert`, formData);
        console.log('Student added successfully:', response.data);
        setInsertStudent("Student added successfully");

      // Update the student list with the new student

      // Clear the form data
      setFormData({
        Name: '',
        Register_number: '',
        Year_of_studying: '',
        Branch_of_studying: '',
        Date_of_Birth: ''
      });

      // Clear search results if any
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div>
      <h2>Student Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Render your form inputs based on the schema */}
        <label>Name:</label>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />

        <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      {/* <button onClick={uploadFile}> Upload Image</button> */}

        <label>Register Number:</label>
        <input type="text" name="Register_number" value={formData.Register_number} onChange={handleChange} required />

        <label>Year of Studying:</label>
        <input type="text" name="Year_of_studying" value={formData.Year_of_studying} onChange={handleChange} />

        <label>Branch of Studying:</label>
        <input type="text" name="Branch_of_studying" value={formData.Branch_of_studying} onChange={handleChange} />

        <label>Date of Birth:</label>
        <input type="text" name="Date_of_Birth" value={formData.Date_of_Birth} onChange={handleChange} />
        <button type="submit" onClick={uploadFile}>Add Student</button>
        {insertStudent && <p>{insertStudent}</p>} 
      </form>
    </div>
  );
};

export default StudentFormPage;
