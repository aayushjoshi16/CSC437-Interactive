import { useState } from "react";
import styles from "./Post.module.css";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

function CreatePost({ isOpen, onClose, onSubmit }: CreatePostProps) {
  const [formData, setFormData] = useState({
    game: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDescription =
      formData.description +
      `. From ${formData.startDate} ${formData.startTime} to ${formData.endDate} ${formData.endTime}!`;
    const newFormData = formData;
    newFormData.description = newDescription;
    onSubmit(newFormData);
    // Reset form data
    setFormData({
      game: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
    onClose();
  };

  // Handle background click to close modal
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h2 id="modal-title">Create a Post</h2>
          <button
            className={styles["close-button"]}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form className={styles["modal-container"]} onSubmit={handleSubmit}>
          <div className={styles["post-entry"]}>
            <label htmlFor="game">Game name:</label>
            <textarea
              id="game"
              name="game"
              rows={1}
              value={formData.game}
              onChange={handleChange}
              required
              aria-required="true"
              autoFocus
            ></textarea>
          </div>

          <div className={styles["post-entry"]}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter your message here"
              required
              aria-required="true"
            ></textarea>
          </div>

          <div className={styles["post-entry"]}>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className={styles["post-entry"]}>
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className={styles["post-entry"]}>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className={styles["post-entry"]}>
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className={styles["modal-footer"]}>
            <button
              type="button"
              onClick={onClose}
              className={styles["cancel-button"]}
            >
              Cancel
            </button>
            <button type="submit" className={styles["submit-button"]}>
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
