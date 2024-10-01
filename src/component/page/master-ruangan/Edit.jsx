import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterRuanganEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    rgn_nama: "",
    rgn_lantai: "",
    rgn_gedung: "",
    rgn_status: "",
  });

  const ruanganSchema = object({
    rgn_nama: string().required("Nama ruangan harus diisi"),
    rgn_lantai: string().required("Lantai harus diisi"),
    rgn_gedung: string().required("Gedung harus diisi"),
    rgn_status: string().required("Status harus diisi"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false, message: "" });

      try {
        const data = await UseFetch(API_LINK + "MasterRuangan/GetDataRuanganById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data ruangan.");
        } else {
          formDataRef.current = { ...formDataRef.current, ...data[0] };
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, ruanganSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      ruanganSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});

      try {
        const data = await UseFetch(API_LINK + "Ruangan/EditRuangan", formDataRef.current);

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
      {isError.error && <Alert type="danger" message={isError.message} />}
      <form onSubmit={handleSave}>
        <div className="card">
          <div className="card-header bg-primary text-white">
            Ubah Data Ruangan
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Label
                  title="Nama Ruangan"
                  data={formDataRef.current.rgn_nama}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  name="rgn_nama"
                  label="Nama Ruangan"
                  value={formDataRef.current.rgn_nama}
                  onChange={handleInputChange}
                  errorMessage={errors.rgn_nama}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  name="rgn_lantai"
                  label="Lantai"
                  value={formDataRef.current.rgn_lantai}
                  onChange={handleInputChange}
                  errorMessage={errors.rgn_lantai}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  name="rgn_gedung"
                  label="Gedung"
                  value={formDataRef.current.rgn_gedung}
                  onChange={handleInputChange}
                  errorMessage={errors.rgn_gedung}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  name="rgn_status"
                  label="Status"
                  value={formDataRef.current.rgn_status}
                  onChange={handleInputChange}
                  errorMessage={errors.rgn_status}
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
