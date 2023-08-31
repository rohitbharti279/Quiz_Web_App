import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import john from "../image/john.png";
import arrow from "../svg/angle-right-solid.svg";
import pin from "../svg/paperclip-solid.svg";
import "./CreateQuiz.scss";
import errors from "../audio/error.mp3"

const CreateQuiz = ({ handleNext, handlePreviousPage }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [time, setTime] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    image: false,
    time: false,
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleNextClick();
  };

  const handleNextClick = () => {
    if (!title.trim() || !image.trim() || !time.trim()) {
      new Audio(errors).play();
      setFieldErrors({
        title: !title.trim(),
        image: !image.trim(),
        time: !time.trim(),
      });
      return;
    } else {
      const data = { title, description, image, time };
      const existingData = JSON.parse(localStorage.getItem("formData")) || [];
      localStorage.setItem("formData", JSON.stringify([...existingData, data]));

      const quizId = localStorage.getItem("quizId");
      const questionSets =
        JSON.parse(localStorage.getItem("questionSets")) || [];
      const updatedSets = questionSets.map((set) =>
        set.id === parseInt(quizId) ? { ...set, title, time } : set
      );
      localStorage.setItem("questionSets", JSON.stringify(updatedSets));

      handleNext(data);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="overflow-scroll max-h-[98vh]">
      <nav className="flex flex-col gap-5 md:gap-0 lg:flex-row justify-between lg:px-7 xl:px-14 bg-[#FFFFFF] sticky top-0">
        <div className="flex gap-3  self-center p-2 lg:p-0">
          <h3 className="text-2xl xl:text-4xl text-[#414A53] tracking-tighter">
            <Router>
              <Link
                to="/"
                className="text-[#2DAF61] hover:cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-8"
                onClick={() => handlePreviousPage()}
              >
                Queen
              </Link>
            </Router>
            <span className="px-2">quizzie</span>
          </h3>
          <hr className="border h-6 self-center text-[#AAADBE]"></hr>
          <p className="self-center font-bold text-[#414A53]">ONLINE QUIZ</p>
        </div>
        <div className="flex flex-col md:flex-row md:gap-7 xl:gap-12 self-center">
          <div className="flex gap-4 lg:gap-5 text-lg xl:text-2xl self-center">
            <p className="text-[#092C4C] ">Quiz List</p>
            <hr className="border h-5  self-center text-[#AAADBE]"></hr>
            <Router>
              <Link
                to="/"
                className="underline underline-offset-8 decoration-2 text-[#2DAF61]"
              >
                Create Quiz
              </Link>
            </Router>
          </div>
          <div className="flex  self-center">
            <Router>
              <Link to="/">
                <img className="w-20" src={john} alt="john"></img>
              </Link>
            </Router>
            <p className="self-center text-[#092C4C] text-lg xl:text-2xl">
              <span className="font-bold">Hello!</span> John
            </p>
          </div>
        </div>
      </nav>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-5 bg-[#FFFFFF] rounded p-2 mt-5 md:mx-5 md:p-5 lg:mt-8 lg:p-6 lg:mx-12 xl:mt-12 xl:mx-32"
      >
        <div className="flex gap-5 md:gap-8 lg:gap-12 border-b pb-5">
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#31A05D] text-white p-1 px-3.5 rounded-full font-bold">
              1
            </span>
            Create a Quiz
          </p>
          <img src={arrow} alt="arrow"></img>
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#DADBE2]  p-1 px-3 rounded-full font-bold">
              2
            </span>
            Add Question
          </p>
        </div>
        <div className="flex flex-col">
          <label htmlFor="title" className="text-[#85909B] text-lg xl:text-xl">
            Quiz Title (Limit: 22 characters)
          </label>
          <input
            type="text"
            maxLength={"22"}
            className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 xl:p-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] xl:px-6 placeholder:italic"
            placeholder="Enter quiz title.."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          {fieldErrors.title && (
            <p className="text-red-500 mt-2">Title is required.</p>
          )}
          <br></br>

          <label
            htmlFor="description"
            className="text-[#85909B] text-lg xl:text-xl"
          >
            Quiz Description
          </label>
          <textarea
            type="text"
            className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 xl:p-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] xl:px-6 resize-none placeholder:italic"
            placeholder="Enter quiz description.."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <br></br>

          <label htmlFor="time" className="text-[#85909B] text-lg xl:text-xl">
            Quiz Time
          </label>
          <input
            type="number"
            className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 xl:p-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] xl:px-6 placeholder:italic"
            placeholder="Enter quiz time in minutes.."
            onKeyDown={(e) => {
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
            }}
            value={time && Math.max(1, time)}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setTime(e.target.value)}
          ></input>
          {fieldErrors.time && (
            <p className="text-red-500 mt-2">Time is required.</p>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex gap-5 justify-between xl:w-[35%]">
            <p className="file-upload flex justify-center p-3 rounded-md gap-3 xl:text-lg xl:w-[47%] cursor-pointer">
              <img
                src={pin}
                alt="pin"
                className="object-scale-down self-center lg:w-6 lg:h-7"
              ></img>
              <span className="text-[#2E4055] font-medium self-center ">
                Attach file
              </span>
              <input
                type="file"
                className="w-40"
                onChange={handleImageUpload}
              ></input>
            </p>
            <p className="text-[#85909B] self-center">Set quiz thumbnail</p>
          </div>
          {fieldErrors.image && (
            <p className="md:hidden text-red-500 -mt-2">Image is required.</p>
          )}

          <button
            className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-3 md:px-5 font-semibold text-center w-[40%] md:w-[20%] lg:w-[17%] mx-auto md:mx-0"
            onClick={handleNextClick}
            type="submit"
          >
            Save & Next
          </button>
        </div>
        {fieldErrors.image && (
          <p className="hidden md:block text-red-500 -mt-2">
            Image is required.
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateQuiz;
