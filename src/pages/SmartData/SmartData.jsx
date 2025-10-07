import {useState, useEffect, useCallback} from "react";
import api from "../../components/auth/axiosConfig.js";
import {
    Box,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Button
} from "@mui/material";
import DataTable from "../../components/common/DataTable.jsx";
import AddSmartData from "./modals/AddSmartData.jsx";
import AddNumber from "./modals/AddNumber.jsx";
import {Database} from "lucide-react";
import PageHeaders from "../../components/common/PageHeaders.jsx";
import EditSmartData from "./modals/EditSmartData.jsx";
import DeleteSmartData from "./modals/DeleteSmartData.jsx";
import {toast} from "react-toastify";

function SmartData() {
    const [smartData, setSmartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNumberModalOpen, setIsNumberModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchSmartData = useCallback(async () => {
        setLoading(true);
        try {
            const {data} = await api.get(`/smart-data?PageIndex=${pageIndex}&PageSize=${pageSize}`);
            setSmartData(data.Data.items);
            setHasMore(data.Data.items.length === pageSize);
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize]);

    useEffect(() => {
        fetchSmartData();
    }, [pageIndex, pageSize]);

    const handleOpenAddNumber = (item) => {
        setSelectedItem(item);
        setSelectedItemId(item.id);
        setIsNumberModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditItem(item);
        setIsEditModalOpen(true);
    };

    const handleOpenDelete = (item) => {
        setDeleteItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (id) => {
        setDeleteLoading(true);
        try {
            await api.delete(`/smart-data/${id}`);
            fetchSmartData();
            setIsDeleteModalOpen(false);
            toast.success("داده با موفقیت حذف شد.", {autoClose: 3000});
        } finally {
            setDeleteLoading(false);
        }
    };

    const tableData = smartData.map((item, index) => ({
        rowNumber: index + 1,
        title: item.title,
        userCount: item.userCount,
        pricePerItem: item.pricePerItem,

    }));

    const handleCloseModal = () => {
        setIsNumberModalOpen(false);
        fetchSmartData();
    }

    const columns = [
        {
            accessorKey: "rowNumber",
            header: "ردیف",
            cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
        },
        {accessorKey: "title", header: "عنوان"},
        {accessorKey: "userCount", header: "تعداد"},
        {
            accessorKey: "pricePerItem",
            header: "قیمت",
            cell: ({row}) => {
                const value = row.getValue("pricePerItem");
                return value?.toLocaleString("fa-IR");
            },
        },
        {
            accessorKey: "actions",
            header: "عملیات",
            cell: ({row}) => (
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenAddNumber(smartData[row.index])}
                    >
                        افزودن تعداد
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenEdit(smartData[row.index])}
                    >
                        ویرایش
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenDelete(smartData[row.index])}
                    >
                        حذف
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current=" داده‌های هوشمند"/>
            <Box className="border-t border-Gray">
                <Box dir="rtl" display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Box display="flex" alignItems="center">
                        <Database sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                        <Typography variant="h6" fontWeight="bold" ml={2}>
                            داده‌های هوشمند
                        </Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        افزودن داده جدید
                    </Button>
                </Box>

                <Box display="flex" py={5} justifyContent="space-between">
                    <Box display="flex" bgcolor="white" borderRadius="1rem" p={5} flexDirection="column"
                         className="min-w-full">
                        <Box mt={4}>
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <CircularProgress/>
                                </div>
                            ) : (
                                <>
                                    <DataTable data={tableData} columns={columns}/>
                                    {tableData.length === 0 && (
                                        <Box mt={2} textAlign="center">
                                            <Typography variant="body1" color="Gray">
                                                داده‌ای یافت نشد.
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box mt={2} display="flex" alignItems="center">
                                        <FormControl size="small" variant="outlined">
                                            <InputLabel>تعداد در هر صفحه</InputLabel>
                                            <Select value={pageSize} onChange={(e) => setPageSize(e.target.value)}
                                                    label="تعداد در هر صفحه">
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Pagination
                                            count={hasMore ? pageIndex + 1 : pageIndex}
                                            page={pageIndex}
                                            onChange={(_, page) => setPageIndex(page)}
                                            color="primary"
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <AddSmartData open={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={fetchSmartData}/>
            <AddNumber open={isNumberModalOpen} onClose={handleCloseModal} item={selectedItem}
                       id={selectedItemId}/>
            <EditSmartData
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                id={editItem?.id}
                item={editItem}
                onUpdate={fetchSmartData}
            />
            <DeleteSmartData
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDeleteConfirm={handleConfirmDelete}
                item={deleteItem}
                loading={deleteLoading}
            />
        </Box>
    );
}

export default SmartData;
