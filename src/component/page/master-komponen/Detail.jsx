import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterKomponenDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    kom_no_komponen: "",
    kom_jenis: "",
    kom_device_id: "",
    kom_kondisi: "",
    kom_watt: "",
    kom_status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false, message: "" });

      try {
        const data = await UseFetch(
          API_LINK + "MasterKomponen/DetailKomponen",
          { id: withID }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data komponen.");
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

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Data Komponen
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-4">
              <Label
                forLabel="kom_no_komponen"
                title="Nomor Komponen"
                data={formDataRef.current.kom_no_komponen}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="kom_jenis"
                title="Jenis"
                data={formDataRef.current.kom_jenis}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="kom_device_id"
                title="Device ID"
                data={formDataRef.current.kom_device_id}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="kom_kondisi"
                title="Kondisi"
                data={formDataRef.current.kom_kondisi}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="kom_watt"
                title="Watt"
                data={formDataRef.current.kom_watt}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="kom_status"
                title="Status"
                data={formDataRef.current.kom_status}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary px-4 py-2"
          label="KEMBALI"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
