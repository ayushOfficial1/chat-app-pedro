import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase-config";
require("../css/Chat.css");

const Chat = ({ room }) => {
  const [newMsg, setnewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messageRef = collection(db, "Messages");
  const msgContainerRef = useRef(null);

  useEffect(() => {
    //eslint-disable-next-line
    const queryMsg = query(
      messageRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsub = onSnapshot(queryMsg, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });
      setMessages(msgs);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMsg === "") {
      alert("Please type a msg before sending.");
      return;
    }
    try {
      await addDoc(messageRef, {
        text: newMsg,
        room,
        user: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
      });
      setnewMsg("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="title">
        <h2>
          Welcome to Room <span>{room}</span>
        </h2>
      </div>
      <div className="msg-container" ref={msgContainerRef}>
        <div className="messages">
          {messages.map((data) => {
            return (
              <div className="text-msg">
                <strong>{data.user} : </strong>
                <span key={data.id}>{data.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="chat-input"
          value={newMsg}
          onChange={(e) => setnewMsg(e.target.value)}
        />
        <button type="submit" class="chat-send">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
