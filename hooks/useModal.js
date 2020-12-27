import { useRouter } from 'next/router';

export default function useModal(id) {
  const router = useRouter();

  const closeModal = () => {
    const newQuery = { ...router.query };
    delete newQuery.modal;
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  const openModal = () => {
    const newQuery = {
      ...router.query,
      modal: id,
    };
    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  return { openModal, closeModal };
}
