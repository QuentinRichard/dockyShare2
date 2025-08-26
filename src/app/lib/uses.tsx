
import { DockyFileData } from '@/db/schema/dockies';
import { IPropertiesTable } from '@/db/schema/property';
import useSWR from 'swr';

// export const fetcher = async (
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetcherPost = (payload: any) => {
  const options = {
    method: "POST",
    body: payload,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  console.log('Call POST')
  return (uri: string) => {
    return fetch(uri, options).then((res) => res.json());
  }
}


const fetcher = (uri: string) => fetch(uri).then((res) => res.json());

export function useTrees() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/trees`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

export function useDockies() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}
export function callDockiesPost(payload: DockyFileData) {
  //const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcherPost(payload))
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  //TODO Improve by managing error and provide error message
  return fetch(`/api/dashboard/dockies`, options).then((res) => res.json());
}

export function callDivPost(payload: IPropertiesTable) {
  //const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcherPost(payload))
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  //TODO Improve by managing error and provide error message
  return fetch(`/api/dashboard/trees`, options).then((res) => res.json());
}


export function useProperties() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/trees`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}
