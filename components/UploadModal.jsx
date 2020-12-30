/* eslint-disable  react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { CheckCircle } from 'react-feather';
import { createPhoto, uploadToS3 } from '../actions/photos';
import { getCurrentUser } from '../actions/users';
import { getGalleries } from '../actions/galleries';
import Modal from './Modal';
import Button from './Button';

export default function UploadModal() {
  const router = useRouter();
  const { familyId } = router.query;
  const { galleryId } = router.query;

  const { data: user } = useQuery('currentUser', getCurrentUser);
  const creatorId = user?._id;

  const { register, handleSubmit } = useForm();

  const queryClient = useQueryClient();

  const { data: galleries } = useQuery(
    ['galleries', { familyId }],
    getGalleries,
    { enabled: !!familyId },
  );

  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState({});
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
    setUploads((prev) => ({
      ...prev,
      [index]: { file: files[index], progress },
    }));
  }

  const uploadLeft = Object.keys(uploads).reduce((prev, k) => {
    const currentProgress = uploads[k].progress;
    return prev + (currentProgress.total - currentProgress.loaded);
  }, 0);

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
      queryClient.invalidateQueries('galleries');
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
        galleryId: data.galleryId === 'None' ? undefined : data.galleryId,
        creatorId,
        familyId,
      });
    }
  }

  const fileEls = files.map((file, index) => (
    <div key={file.path} className="flex items-start mt-5">
      <div className="relative overflow-hidden rounded w-52 h-52">
        <img src={file.preview} className="object-cover w-full h-full" alt="" />
      </div>
      <div className="flex flex-col flex-1 pl-5">
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
        <input
          id={`name-${index}`}
          name={`name-${index}`}
          type="text"
          ref={register}
          placeholder="Name (Optional)"
          defaultValue={file.path}
          className="mb-5 font-bold"
        />
        <textarea
          id={`description-${index}`}
          name={`description-${index}`}
          ref={register}
          placeholder="Description (Optional)"
        />
      </div>
    </div>
  ));

  function reset() {
    setFiles([]);
    setUploads({});
  }

  function customClose() {
    const newQuery = { ...router.query };
    delete newQuery.modal;
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
    reset();
  }

  return (
    <Modal id="upload" header="Upload Photos" customClose={customClose}>
      {!Object.keys(uploads).length && (
        <>
          {!fileEls.length && (
            <div>
              <div
                className="flex items-center justify-center p-20 my-10 border-4 border-dashed rounded border-gray-light"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <p className="text-4xl italic font-thin text-center text-gray-light">
                  Drag and drop photos here, or click to select files
                </p>
              </div>
            </div>
          )}
          {!!fileEls.length && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center mt-5 mb-10">
                <label htmlFor="galleryId">
                  <span className="text-2xl font-bold">Add to Gallery:</span>
                  <select
                    id="galleryId"
                    name="galleryId"
                    ref={register}
                    className="ml-2"
                    defaultValue={galleryId}
                  >
                    <option value={null}>None</option>
                    {galleries &&
                      galleries.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              {fileEls}
              <div className="flex justify-end pt-5">
                <Button
                  type="submit"
                  className="text-xl text-white bg-gray-dark"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </>
      )}
      {!!Object.keys(uploads).length && (
        <>
          {!!uploadLeft && (
            <>
              <div className="my-5 text-2xl font-thin text-center">
                Your files are now uploading. Please do not close this tab.
              </div>
              {Object.keys(uploads).map((u) => {
                const { file, progress } = uploads[u];
                const percent = Math.round(
                  (progress.loaded * 100) / progress.total,
                );
                return (
                  <div key={file.name} className="mt-10">
                    <div className="font-bold">{file.name}</div>
                    <div className="relative w-full h-3 overflow-hidden bg-gray-light rounded-md">
                      <div
                        className="h-3 bg-green-medium"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-center">{`${percent}%`}</div>
                  </div>
                );
              })}
            </>
          )}
          {!uploadLeft && (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center m-auto text-white rounded-full w-52 h-52 bg-green-medium">
                  <CheckCircle size={128} />
                </div>
                <div className="my-10 text-4xl font-thin text-center">
                  Upload complete!
                </div>
                <div className="flex justify-center w-full">
                  <Button
                    onClick={customClose}
                    className="mr-2 text-xl text-white w-36 bg-gray-light"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={reset}
                    className="text-xl text-white w-36 bg-gray-light"
                  >
                    Upload More
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
