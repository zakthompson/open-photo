import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useModal from '../hooks/useModal';
import { createGallery } from '../actions/galleries';
import { getCurrentUser } from '../actions/users';
import Modal from './Modal';
import Button from './Button';

export default function NewGalleryModal() {
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm();
  const { closeModal } = useModal('create-gallery');
  const queryClient = useQueryClient();
  const { data: user } = useQuery('currentUser', getCurrentUser);

  const creatorId = user?.id;
  const { familyId } = router.query;

  const { mutate } = useMutation(createGallery, {
    onSuccess: () => {
      queryClient.invalidateQueries('galleries');
      closeModal();
    },
  });

  function onSubmit({ name }) {
    mutate({
      name,
      creatorId,
      familyId,
    });
  }

  return (
    <Modal id="create-gallery" header="Create Gallery">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-end">
          <input
            id="name"
            type="text"
            name="name"
            ref={register({ required: true })}
            placeholder="Name"
            className="w-full mb-5"
          />
          {errors.name && <div>This field is required</div>}
          <Button type="submit" className="text-white bg-gray-dark">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
