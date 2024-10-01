import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import { formatDate } from "../../util/Formatting";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "No. Registrasi Permintaan": null,
    "No. Permintaan Pelanggan": null,
    "Nama Pelanggan": null,
    "Tanggal Permintaan": null,
    "Estimasi Penawaran": null,
    Status: null,
    Count: 0,
  },
];

const dataFilterSort = [
  {
    Value: "[Tanggal Buat] asc",
    Text: "No. Registrasi Permintaan [↑]",
  },
  {
    Value: "[Tanggal Buat] desc",
    Text: "No. Registrasi Permintaan [↓]",
  },
  {
    Value: "[No. Permintaan Pelanggan] asc",
    Text: "No. Permintaan Pelanggan [↑]",
  },
  {
    Value: "[No. Permintaan Pelanggan] desc",
    Text: "No. Permintaan Pelanggan [↓]",
  },
  { Value: "[Nama Pelanggan] asc", Text: "Nama Pelanggan [↑]" },
  { Value: "[Nama Pelanggan] desc", Text: "Nama Pelanggan [↓]" },
  { Value: "[Tanggal Permintaan] asc", Text: "Tanggal Permintaan [↑]" },
  { Value: "[Tanggal Permintaan] desc", Text: "Tanggal Permintaan [↓]" },
  { Value: "[Estimasi Penawaran] asc", Text: "Estimasi Penawaran [↑]" },
  { Value: "[Estimasi Penawaran] desc", Text: "Estimasi Penawaran [↓]" },
];

const dataFilterStatus = [
  { Value: "Draft", Text: "Draft" },
  { Value: "Menunggu Analisa", Text: "Menunggu Analisa" },
  { Value: "Belum Dibuat RAK", Text: "Belum Dibuat RAK" },
  { Value: "Belum Dibuat Penawaran", Text: "Belum Dibuat Penawaran" },
  { Value: "Sudah Dibuat Penawaran", Text: "Sudah Dibuat Penawaran" },
  { Value: "Batal", Text: "Batal" },
];

export default function PermintaanPelangganIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Tanggal Buat] desc",
    status: "",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "PermintaanPelanggan/GetDataPermintaanPelanggan",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            "Tanggal Permintaan": formatDate(value["Tanggal Permintaan"], true),
            "Estimasi Penawaran": formatDate(value["Estimasi Penawaran"], true),
            Aksi: [
              !["Draft", "Batal"].includes(value["Status"]) ? "Cancel" : "",
              ["Draft"].includes(value["Status"]) ? "Delete" : "",
              "Detail",
              ["Draft"].includes(value["Status"]) ? "Edit" : "",
              ["Draft"].includes(value["Status"]) ? "Sent" : "",
            ],
            Alignment: [
              "center",
              "center",
              "center",
              "left",
              "center",
              "center",
              "center",
              "center",
            ],
          }));
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data permintaan pelanggan."
            />
          </div>
        )}
        <div className="flex-fill">
          <div className="input-group">
            <Button
              iconName="add"
              classType="success"
              label="Tambah"
              onClick={() => onChangePage("add")}
            />
            <Input
              ref={searchQuery}
              forInput="pencarianPermintaanPelanggan"
              placeholder="Cari"
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              onClick={handleSearch}
            />
            <Filter>
              <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                arrData={dataFilterSort}
                defaultValue="[Tanggal Buat] desc"
              />
              <DropDown
                ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="semua"
                arrData={dataFilterStatus}
                defaultValue=""
              />
            </Filter>
          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column">
              <Table data={currentData} />
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData[0]["Count"]}
                navigation={handleSetCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
