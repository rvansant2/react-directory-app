import { useState, useEffect } from 'react';

// Simple localized cache to store URL data if it was called already to prevent multiple calls from the application.
let cache: { [url: string]: unknown } = {};
// Variable to set pendingRequests aligned to URLs being called and called once.
const pendingRequests: { [url: string]: Promise<unknown> } = {}

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url) => {
  //State variables
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if there is a URL passed, else return and use default type UseCachingFetch.
    if (!url)  {
      return;
    }
    // Adding support for the asynchronous call in fetching URL promise in useEffect.
    const fetchData = async () => {
      // Check if URL has been called already, else return and set data Webhook state, loading state and return.
       if (cache[url]) {
        setData(cache[url]);
        setIsLoading(false);
        return;
      // Check if there is a pending request and make promise call to URL and get data, set loading state and grab and set data.
      } else if (await pendingRequests[url]) {
        setIsLoading(true);
        try {
          const result = await pendingRequests[url];
          setData(result);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
        return;
      }
    
      // Set loading state
      setIsLoading(true);
      // Create method to make URL fetch calls for pendingRequests, set loading states and set data in Webhook state.
      /**
       * TODO: Need to break out this call to be DRY
       */
      const fetchPromise = fetch(url)
      .then((response) => {
        // Check a response was recieved, else throw error.
        if (!response.ok) {
          throw new Error('A proper response was not received or ok.')
        }
        // Return ok response JSON data.
        return response.json();
      })
      // Result data received
      .then((result) => {
        cache[url] = result;
        setData(result);
        setIsLoading(false);
        return result;
      })
      // Set caught error in Webhook state from promise chain
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        throw err;
      });


      try {
        fetchPromise;
      } finally {
        // Remove pendingRequests URL.
        delete pendingRequests[url];
      };
    };

    fetchData();
  }, [url]);
  // Return set states
  return {
    isLoading,
    data,
    error,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  // Check if URL has been called and cached in localized cache or URL call is pending.
  if (cache[url] || await pendingRequests[url]) {
    return;
  }
  // Set up fetch data method.
  /**
   * TODO: Need to break out this call to be DRY
   */
  const fetchPromise = fetch(url)
    .then((response) => {
      // Check a response was recieved, else throw error.
      if (!response.ok) {
        throw new Error('A proper response was not received or ok.')
      }
      // Return ok response JSON data.
      return response.json();
    })
    // Data result received and store in localized cache.
    .then((result) => {
      cache[url] = result;
      // console.log(cache);
    })
    // Catch error in promise chain.
    .catch((err) => {
      throw err;
    });
    // Set pendingRequest call
    pendingRequests[url] = fetchPromise;
    // Call fetchPromise
    try {
      await fetchPromise;
    } finally {
      // Remove pendingRequest url call, data was received and cached.
      delete pendingRequests[url];
    }
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => '';

export const initializeCache = (serializedCache: string): void => {};

export const wipeCache = (): void => {};
