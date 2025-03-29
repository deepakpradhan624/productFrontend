import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [options, setOptions] = useState([]);
  const [inputValues, setInputValues] = useState({
    BatchNumber: "",
    ExpiryDate: "",
    InwardQty: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [forms, setForms] = useState([
    {
      id: 1,
    },
  ]);

  // Fetching the productsku option
  useEffect(() => {
    const fetchOption = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4002/products");
        console.log("response", response);
        setOptions(response.data?.data);
        setIsLoading(false);
      } catch (error) {
        setIsError("Failed to fetch option");
        setIsLoading(false);
      }
    };
    fetchOption();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      setIsError("Please Select an option");
      return;
    }
    try {
      setIsLoading(true);
      setIsError(null);
      setSuccess(false);

      const payload = {
        Product_SKU: `#${selectedOption}`,
        ...inputValues,
      };
      console.log("payload", payload);

      await axios.post("http://localhost:4002/add-update-product", payload);
      setSuccess(true);

      setSelectedOption("");
      setInputValues({
        BatchNumber: "",
        ExpiryDate: "",
        InwardQty: "",
      });
    } catch (error) {
      setIsError(error.response?.data?.message || "Submission Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddForm = () => {
    const newId =
      forms.length > 0 ? Math.max(...forms.map((f) => f.id)) + 1 : 1;
    setForms([
      ...forms,

      {
        id: newId,
      },
    ]);
  };

  const handleRemoveForm = (id) => {
    if (forms.length <= 1) return;
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleReset = () => {
    setSelectedOption("");
    setInputValues({
      BatchNumber: "",
      ExpiryDate: "",
      InwardQty: "",
    });
  };

  return (
    <>
      <div className="dynamic-form-container">
        <h2 className="form-title">Product Form</h2>

        <form className="form-wrapper" onSubmit={handleSubmit}>
          <table className="form-table">
            <thead className="table-header">
              <tr>
                <th>Product SKU</th>
                <th>Batch Number</th>
                <th>Expiry Date</th>
                <th>Inward Qty</th>
              </tr>
            </thead>
            {forms.map((form) => (
              <tbody>
                <tr className="table-row">
                  <td>
                    <select
                      value={selectedOption}
                      onChange={handleSelectChange}
                      className="form-select"
                    >
                      <option value="">Select Option</option>
                      {/* option map will occur here */}
                      {numbers?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="BatchNumber"
                      value={inputValues.BatchNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="ExpiryDate"
                      value={inputValues.ExpiryDate}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="InwardQty"
                      value={inputValues.InwardQty}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </td>
                  <td>
                    {forms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveForm(form.id)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>

          <div className="button-group">
            <button type="button" onClick={handleAddForm}>
              Add Row
            </button>
          </div>

          <div className="submit-button">
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? "button-loading" : ""}`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="cancelled-button">
            <button
              onClick={handleReset}
              // disabled={isLoading}
              // className={`submit-button ${isLoading ? "button-loading" : ""}`}
            >
              Cancel
            </button>
          </div>

          {isError && <div className="error-message">{isError}</div>}
          {success && (
            <div className="success-message">Form Submitted successfully!</div>
          )}
        </form>
      </div>

      <div>
        <table className="form-table">
          <thead className="table-header">
            <tr>
              <th>Product SKU</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Inward Qty</th>
              <th>Created At</th>
            </tr>
          </thead>
          {options.map((el) => (
            <tbody>
              <tr className="table-row">
                <td>{el.Product_SKU}</td>
                <td>{el.BatchNumber}</td>
                <td>{el.ExpiryDate}</td>
                <td>{el.InwardQty}</td>
                <td>{el.CreatedAT}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

export default Dashboard;
