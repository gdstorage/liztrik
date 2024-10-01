import { useEffect, useState } from "react";
import { object, string, number } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterKomponenEdit({ onChangePage, withID }) {
  // State untuk data form dan error handling
  const [formData, setFormData] = useState({
    kom_id: "",
    kom_no_komponen: "",
    kom_jenis: "",
    kom_device_id: "",
    kom_kondisi: "",
    kom_watt: "",
    kom_status: "",
  });

  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Schema validasi Yup
  const userSchema = object({
    kom_no_komponen: string()
      .max(100, "Maksimum 100 karakter")
      .required("Nomor komponen harus diisi"),
    kom_jenis: string().required("Jenis harus diisi"),
    kom_device_id: string().required("Device ID harus diisi"),
    kom_kondisi: string().required("Kondisi harus diisi"),
    kom_watt: number()
      .typeError("Watt harus berupa angka")
      .required("Watt harus diisi"),
    kom_status: string().required("Status harus diisi"),
  });

  // Mengambil data komponen berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false, message: "" });

      try {
        const data = await UseFetch(
          API_LINK + "MasterKomponen/GetDataKomponenById",
          { id: withID }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data komponen.");
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
  const handleEdit = async (e) => {
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
          API_LINK + "MasterKomponen/EditKomponen",
          formData
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data komponen.");
        } else {
          SweetAlert("Sukses", "Data komponen berhasil disimpan", "success");
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
      <form onSubmit={handleEdit}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Ubah Data Komponen
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="kom_no_komponen"
                  label="Nomor Komponen"
                  isRequired
                  value={formData.kom_no_komponen}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_no_komponen}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="kom_jenis"
                  label="Jenis"
                  isRequired
                  value={formData.kom_jenis}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_jenis}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="kom_device_id"
                  label="Device ID"
                  isRequired
                  value={formData.kom_device_id}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_device_id}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="kom_kondisi"
                  label="Kondisi"
                  isRequired
                  value={formData.kom_kondisi}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_kondisi}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="number"
                  forInput="kom_watt"
                  label="Watt"
                  isRequired
                  value={formData.kom_watt}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_watt}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="kom_status"
                  label="Status"
                  isRequired
                  value={formData.kom_status}
                  onChange={handleInputChange}
                  errorMessage={errors.kom_status}
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
