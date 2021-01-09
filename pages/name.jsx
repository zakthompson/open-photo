import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCurrentUser, updateUser } from '../actions/users';
import Layout from '../components/Layout';

export default function Name() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, errors } = useForm();

  const { data: user } = useQuery('currentUser', getCurrentUser);
  const { mutate } = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
    },
  });

  const id = user?.id;

  function onSubmit({ name }) {
    mutate({
      id,
      name,
    });
  }

  return (
    <Layout>
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
    </Layout>
  );
}
