import {useState, useEffect, useCallback} from "react";
import {toast} from "react-toastify";
import {Briefcase, Trash2} from "lucide-react";
import PageHeaders from "../../components/common/PageHeaders.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Pagination,
    Select,
    MenuItem,
} from "@mui/material";
import AddBusiness from "./modals/AddBusiness.jsx";
import EditBusinessModal from "./modals/EditBusiness.jsx";
import api from "../../components/auth/axiosConfig.js";
import OwnerManagerModal from "./modals/owners/OwnerManagerModal.jsx";
import BranchManagerModal from "./modals/branches/BranchManagerModal.jsx";
import DeleteBusiness from "./modals/DeleteBusiness.jsx";

function Business() {
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState({type: "", open: false});
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const handleBusinessDelete = () => {
        fetchBusiness();
        toast.success("کسب‌وکار با موفقیت حذف شد.");
    };

    const fetchBusiness = useCallback(async () => {
        setLoading(true);
        try {
            const {data} = await api.get(
                `/Business?PageIndex=${pageIndex}&PageSize=${pageSize}`
            );
            const businessData = data.Data;
            setBusiness(Array.isArray(businessData.items) ? businessData.items : []);
            setTotalPages(businessData.totalPages);
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize]);

    const handleOpenModal = (type, id, business = null) => {
        setSelectedBusiness(business);
        setSelectedBusinessId(id);
        setModalState({type, open: true});
    };

    const handleCloseModal = () => {
        setModalState({type: "", open: false});
    };

    const handleBusinessCreated = () => {
        fetchBusiness();
        toast.success("کسب‌وکار با موفقیت ایجاد شد.");
    };

    const handleBusinessUpdated = () => {
        fetchBusiness();
        toast.success("کسب‌وکار با موفقیت ویرایش شد.");
    };
    useEffect(() => {
        fetchBusiness();
    }, [fetchBusiness]);

    const tableData = Array.isArray(business)
        ? business.map((item, index) => ({
            id: item.id,
            rowNumber: index + 1,
            title: item.title,
            transactionCount: item.transactionCount,
            customerCount: item.customerCount,
            owners: item.owners,
            branchNames: item.branchNames,
        }))
        : [];

    const columns = [
        {
            accessorKey: "rowNumber",
            header: "ردیف",
            cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
        },
        {accessorKey: "title", header: "نام کسب و کار"},
        {accessorKey: "transactionCount", header: "تعداد تراکنش"},
        {accessorKey: "customerCount", header: "تعداد مشتریان"},
        {
            accessorKey: "actions",
            header: "عملیات",
            cell: ({row}) => (
                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal("edit", row.original)}
                    >
                        ویرایش
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleOpenModal("branches", row.original.id, row.original)}
                    >
                        مدیریت شعب
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                            handleOpenModal(
                                "owners",
                                row.original.id,
                                row.original
                            )
                        }
                    >
                        مدیریت مالکین
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal("delete", row.original.id)}
                    >
                        <Trash2/>
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current="کسب و کار"/>
            <Box className="border-t border-Gray">
                <Box
                    dir="rtl"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={5}
                >
                    <Box display="flex" alignItems="center">
                        <Briefcase sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                        <Typography variant="h6" fontWeight="bold" ml={2}>
                            کسب و کار
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenModal("add")}
                        >
                            افزودن کسب و کار
                        </Button>
                    </Box>
                </Box>

                <Box display="flex" py={5} justifyContent="space-between">
                    <Box
                        display="flex"
                        bgcolor="white"
                        borderRadius="1rem"
                        p={5}
                        flexDirection="column"
                        className="min-w-full"
                    >
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
                                            <Select
                                                value={pageSize}
                                                onChange={(e) => setPageSize(e.target.value)}
                                                label="تعداد در هر صفحه"
                                            >
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Pagination
                                            count={totalPages}
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
            <AddBusiness
                isOpen={modalState.type === "add"}
                onClose={handleCloseModal}
                onBusinessCreated={handleBusinessCreated}
                businessId={selectedBusinessId}
            />
            <EditBusinessModal
                isOpen={modalState.type === "edit"}
                onClose={handleCloseModal}
                businessData={selectedBusiness}
                onBusinessUpdated={handleBusinessUpdated}
                businessId={selectedBusinessId}
            />
            <OwnerManagerModal
                isOpen={modalState.type === "owners"}
                onClose={handleCloseModal}
                businessId={selectedBusinessId}
                owners={selectedBusiness?.owners || []}
                onOwnersChanged={() => {
                    fetchBusiness();
                    handleCloseModal();
                }}
            />
            <DeleteBusiness
                isOpen={modalState.type === "delete"}
                onClose={handleCloseModal}
                onBusinessDelete={handleBusinessDelete}
                businessId={selectedBusinessId}
            />
            <BranchManagerModal
                isOpen={modalState.type === "branches"}
                onClose={handleCloseModal}
                selectedBusiness={selectedBusiness}
                businessId={selectedBusinessId}
                onBranchCreated={() => {
                    fetchBusiness();
                    handleCloseModal();
                    toast.success("شعبه جدید اضافه شد.");
                }}
            />

        </Box>
    );
}

export default Business;
