import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { updateUser } from '../actions/users';
import { UserContext } from '../context/userContext';

export default function Name() {
  const router = useRouter();
  const { state, actions } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm();
  const { mutate } = useMutation(updateUser, {
    onSuccess: (updatedUser) => {
      actions.setUser(updatedUser);
      router.push('/family');
    },
  });

  const { _id, uid } = state.user;

  function onSubmit({ name }) {
    mutate({
      id: _id,
      uid,
      name,
    });
  }

  return (
    <>
      <h2>Finish Up Your Profile</h2>
      <p>Enter the name you would like others to see you as across the app</p>
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
