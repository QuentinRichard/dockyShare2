
import useSWR from 'swr';

// export const fetcher = async (
//   url: string,
//   payload?: string,
// ) => {
//   const options = {
//     method: payload ? "POST" : "GET",
//     ...(payload && { body: payload }),
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   };

//   return fetch(url, options)
//     .then(r => {
//       const ret = r.json();
//       console.log("############=>", JSON.stringify(ret))
//       return ret;
//     });

// };
const fetcher = (uri: string) => fetch(uri).then((res) => res.json());

export function useTrees() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/trees`, fetcher)

  return {
    trees: data,
    isLoading,
    isError: error
  }
}

export function useDockies() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcher)

  return {
    user: data,
    isLoading,
    isError: error
  }
}

