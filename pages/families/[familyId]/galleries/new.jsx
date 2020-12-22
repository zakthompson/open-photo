import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { UserContext } from '../../../../context/userContext';
import { createGallery } from '../../../../actions/galleries';

export default function NewGallery() {
  const router = useRouter();
  const { state } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm();
  const queryClient = useQueryClient();

  const creatorId = state.user?._id;
  const { familyId } = router.query;

  const { mutate } = useMutation(createGallery, {
    onSuccess: () => {
      queryClient.invalidateQueries('galleries');
      router.push(`/families/${familyId}`);
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
    <>
      <h2>Create New Gallery</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            name="name"
            ref={register({ required: true })}
          />
        </label>
        {errors.name && <div>This field is required</div>}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
