import { useCallback, useState } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, requestSpecification) => {
    const response = await fetch(url, requestSpecification);
    let responseJSON;
    if (response.ok || response.status === 201) {
      try {
        responseJSON = await response.json();
        return responseJSON;
      } catch (error) {
        responseJSON = {
          code: response.status,
          message: 'Session deactivated'
        };
        return responseJSON;
      }
    }
    try {
      responseJSON = await response.json();
    } catch (error) {
      responseJSON = { code: 500, message: 'Internal server error' };
    }
    setError(responseJSON.message);
    throw new Error(responseJSON.message);
  };

  const sendRequest = useCallback(async (requestConfiguration, setData) => {
    setIsLoading(true);
    setError(null);
    const url = requestConfiguration.url;
    const requestSpecification = {
      method: requestConfiguration.method ? requestConfiguration.method : 'GET',
      headers: requestConfiguration.header ? requestConfiguration.header : {},
      body: requestConfiguration.body
        ? JSON.stringify(requestConfiguration.body)
        : null
    };
    const data = await fetchData(url, requestSpecification);
    setData(data);
    setIsLoading(false);
  }, []);

  return { isLoading, error, sendRequest };
};

export default useHttp;
