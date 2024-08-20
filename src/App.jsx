import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [continents, setContinents] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Function to perform the GraphQL fetch
  const fetchGraphQL = (querySet, variablesSet = {}) => {
    return fetch("https://countries.trevorblades.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: querySet,
        variables: variablesSet,
      }),
    }).then((res) => res.json());
  };

  // Fetch continents only once when the component mounts
  useEffect(() => {
    const query1 = `query {
      continents {
        name
        code
      }
    }`;

    fetchGraphQL(query1).then((data) => {
      setContinents(data.data.continents);
    });
  }, []);

  // Fetch countries whenever the inputValue changes
  useEffect(() => {
    if (inputValue) {
      const query2 = `query($code: ID!) {
        continent(code: $code) {
          countries {
            name
          }
        }
      }`;

      fetchGraphQL(query2, { code: inputValue }).then((data) => {
        setCountries(data.data.continent.countries);
      });

      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inputValue]);

  return (
    <>
      <h1>Select Continent</h1>
      <select
        className="custom-select"
        onChange={(e) => setInputValue(e.target.value)}
      >
        <option selected hidden>
          Select a Continent
        </option>
        {continents.map((item, index) => (
          <option key={index} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
      {countries.length > 0 && (
        <>
          <h3>Countries in {inputValue}</h3>
          <div className={isVisible ? "reveal" : ""}>
            <div className="country-contain">
              {countries.map((item, index) => (
                <p key={index} className="country">
                  {item.name}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;