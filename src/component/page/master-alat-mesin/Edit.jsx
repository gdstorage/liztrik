import { useEffect, useState, useRef } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterRuanganEdit({ onChangePage, withID }) {
  // State untuk data form dan error handling
  const [formData, setFormData] = useState({
    idRuangan: "",
    namaRuangan: "",
    lantai: "",
    gedung: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Schema validasi Yup
  const userSchema = object({
    idRuangan: string(),
    namaRuangan: string()
      .max(100, "Maksimum 100 karakter")
      .required("Nama ruangan harus diisi"),
    lantai: string().required("Lantai harus diisi"),
    gedung: string().required("Gedung harus diisi"),
    status: string().required("Status harus diisi"),
  });

  // Mengambil data ruangan berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false, message: "" });

      try {
        const data = await UseFetch(
          API_LINK + "MasterRuangan/GetDataRuanganById",
          { id: withID }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data ruangan.");
        } else {
          setFormData(data[0]); // Set data form
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  // Handle perubahan input
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  // Handle submit form
  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formData,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterRuangan/EditRuangan",
          formData
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data ruangan.");
        } else {
          SweetAlert("Sukses", "Data ruangan berhasil disimpan", "success");
          onChangePage("index");
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Ubah Data Ruangan
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="namaRuangan"
                  label="Nama Ruangan"
                  isRequired
                  value={formData.namaRuangan}
                  onChange={handleInputChange}
                  errorMessage={errors.namaRuangan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="lantai"
                  label="Lantai"
                  isRequired
                  value={formData.lantai}
                  onChange={handleInputChange}
                  errorMessage={errors.lantai}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="gedung"
                  label="Gedung"
                  isRequired
                  value={formData.gedung}
                  onChange={handleInputChange}
                  errorMessage={errors.gedung}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="status"
                  label="Status"
                  isRequired
                  value={formData.status}
                  onChange={handleInputChange}
                  errorMessage={errors.status}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="BATAL"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SIMPAN"
          />
        </div>
      </form>
    </>
  );
}
