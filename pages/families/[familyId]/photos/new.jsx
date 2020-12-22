/* eslint-disable  react/jsx-props-no-spreading */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { UserContext } from '../../../../context/userContext';
import { createPhoto, uploadToS3 } from '../../../../actions/photos';
import { getGalleries } from '../../../../actions/galleries';

export default function NewPhoto() {
  const router = useRouter();
  const { familyId } = router.query;

  const { state } = useContext(UserContext);
  const creatorId = state.user?._id;

  const { register, handleSubmit } = useForm();

  const queryClient = useQueryClient();

  const { data: galleries } = useQuery(
    ['galleries', { familyId }],
    getGalleries,
  );

  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  const { mutate: upload } = useMutation(uploadToS3, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  function updateProgress(index, progress) {
    console.log(progress);
    const newUploads = [...uploads];
    newUploads[index] = { file: files[index], progress };
    setUploads(newUploads);
  }

  const { mutate: getSignedUrl } = useMutation(createPhoto, {
    onSuccess: (data) => {
      const { index, presignedUrl } = data;
      upload({
        index,
        url: presignedUrl,
        file: files[index],
        onUploadProgress: updateProgress,
      });
      queryClient.invalidateQueries('photos');
    },
  });

  function onSubmit(data) {
    const iterations = Object.keys(data).length / 5;
    for (let i = 0; i < iterations; i += 1) {
      getSignedUrl({
        index: i,
        name: data[`name-${i}`],
        type: data[`type-${i}`],
        filename: data[`filename-${i}`],
        description: data[`description-${i}`],
        galleryId:
          data[`galleryId-${i}`] === 'None'
            ? undefined
            : data[`galleryId-${i}`],
        creatorId,
        familyId,
      });
    }
  }

  const fileEls = files.map((file, index) => (
    <div key={file.path} className="mt-5">
      <img src={file.preview} className="w-1/2" alt="" />
      <input
        id={`filename-${index}`}
        name={`filename-${index}`}
        type="hidden"
        value={file.path}
        ref={register}
      />
      <input
        id={`type-${index}`}
        name={`type-${index}`}
        type="hidden"
        value={file.type}
        ref={register}
      />
      <label htmlFor={`name-${index}`}>
        Name:
        <input
          id={`name-${index}`}
          name={`name-${index}`}
          type="text"
          ref={register}
          placeholder={file.path}
        />
      </label>
      <label htmlFor={`description-${index}`}>
        Description:
        <textarea
          id={`description-${index}`}
          name={`description-${index}`}
          ref={register}
        />
      </label>
      <label htmlFor={`galleryId-${index}`}>
        Gallery
        <select
          id={`galleryId-${index}`}
          name={`galleryId-${index}`}
          ref={register}
        >
          <option value={undefined}>None</option>
          {galleries.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  ));

  return (
    <>
      <h2>Upload Photos</h2>
      <div>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag and drop images here, or click to select files!</p>
        </div>
      </div>
      {!!fileEls.length && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {fileEls}
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}
