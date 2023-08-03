/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ImageUpload = ({ setImageUrl }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = async ({ fileList: newFileList }) => {
    try {
      setFileList(newFileList);

      const formData = new FormData();
      formData.append("file", newFileList[0].originFileObj);

      await axios.post("http://localhost:5000/upload", formData).then((res) => {
        if (res.status === 200) {
          setImageUrl(res.data.url);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadButton = (
    <div className="px-16">
      <PlusOutlined />
      <div style={{ marginTop: 8, fontSize: "18px" }}>Upload an Image</div>
    </div>
  );

  return (
    <div className="">
      <Upload
        action="http://localhost:5000/upload"
        className="text-black w-80"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList?.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default ImageUpload;
