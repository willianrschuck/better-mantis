import { useState, useEffect } from 'react';

function useChromeStorage(key, initialValue) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        try {
          setState(JSON.parse(result[key]));
        } catch (e) {
          setState(initialValue);
        }
      }
    });

    const listener = (changes, namespace) => {
      if (namespace === 'local' && changes[key]) {
        setState(JSON.parse(changes[key].newValue));
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [key]);

  const setChromeStorage = (value) => {
    let value2 = JSON.stringify(value);
    chrome.storage.local.set({ [key]: value2 });
  }

  return [state, setChromeStorage];
}

function useAllChromeData() {
  const [ state, setState ] = useState({})

  useEffect(() => {
    chrome.storage.local.get(null, (result) => {
      setState(result)
    });

    const listener = (changes, _) => {
      setState(
        ...state,
        ...changes
      );
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [])

  return [ state ];
}

export {
  useChromeStorage, useAllChromeData
}