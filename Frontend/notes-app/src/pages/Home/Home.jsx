import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import { Navbar } from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import { EmptyCard } from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const [openAndEditModal, setOpenAndEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAndEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Delete a note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        // Filter out the deleted note from allNotes
        setAllNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
        showToastMessage("Note Deleted Successfully", "delete");
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again", error);
    }
  };

  //Search for notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      console.log(response.data);

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    try {
      const noteId = noteData._id;
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      ></Navbar>
      <div className='mx-auto container'>
        {allNotes.length > 0 ? (
          <div className=' m-4 grid grid-cols-1 gap-4 mt-8  sm:grid-cols-2 md:grid-cols-3'>
            {allNotes.map((value) => {
              return (
                <NoteCard
                  key={value._id}
                  title={value.title}
                  date={moment(value.createdOn).format("Do MMM YYYY")}
                  content={value.content}
                  tags={value.tags}
                  isPinned={value.isPinned}
                  onEdit={() => handleEdit(value)}
                  onDelete={() => deleteNote(value)}
                  onPinNote={() => updateIsPinned(value)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard isSearch={isSearch} />
        )}
        <button
          className='w-16 h-16 flex items-center justify-center rounded-2xl text-center bg-primary hover:bg-blue-600 fixed right-10 bottom-10'
          onClick={() => {
            setOpenAndEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className='sm:text-[32px] text-[28px] text-white' />
        </button>

        <Modal
          isOpen={openAndEditModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=''
          className=' w-[90%] lg:w-[40%] max-h-[3/4] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-scroll'
        >
          <AddEditNotes
            type={openAndEditModal.type}
            noteData={openAndEditModal.data}
            onClose={() => {
              setOpenAndEditModal({
                isShown: false,
                type: "add",
                data: null,
              });
            }}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
          ></AddEditNotes>
        </Modal>

        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </>
  );
};

export default Home;
