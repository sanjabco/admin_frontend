import {useState, useEffect} from "react";
import api from "../../components/auth/axiosConfig.js"
import PageHeaders from "../../components/common/PageHeaders.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Pagination,
} from "@mui/material";
import {Storefront as StorefrontIcon} from "@mui/icons-material";


const SMScolumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "type",
        header: "نوع",
        cell: ({getValue}) => {
            const typeMap = {
                CashBack: "کش‌بک",
                CreditEvent: "طرح اعتباری",
                Messages: "پیام"
            };

            return typeMap[getValue()] || getValue();
        }
    },
    {accessorKey: "businessTitle", header: "عنوان کسب و کار"},
    {
        accessorKey: "totalPrice",
        header: "قیمت کل",
        cell: ({row}) => {
            const value = row.getValue("totalPrice");
            return new Intl.NumberFormat("fa-IR").format(value);
        },
    },
    {accessorKey: "date", header: "تاریخ"},
    {accessorKey: "numberOfMessages", header: "مقدار پیام ها"},
    {accessorKey: "numberOfSent", header: "تعداد ارسالی "},
    {accessorKey: "numberInQueue", header: "تعداد در صف"},
    {accessorKey: "numberFailed", header: "تعداد نرسیده"},
    {
        accessorKey: "internalMessageStatus",
        header: "وضعیت پیام",
        cell: ({row}) => {
            const status = row.getValue("internalMessageStatus");
            const statusMap = {
                "PendingOnBusinessApproval": "منتظر تایید کسب و کار",
                "PendingOnAdminApproval": "منتظر تایید مدیریت",
                "Confirmed": "پذیرفته شده",
                "customerClub": "ارسال شده",
                "RejectedByBusiness": "رد شده توسط کسب و کار",
                "RejectedByAdmin": "رد شده توسط مدیریت",
            };

            return statusMap[status] || "نامشخص";
        },
    },
];

function SMSSystem() {
    const [sms, setSms] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageIndex(1);
    };

    const fetchSMS = async (PageSize, PageIndex) => {
        setLoading(true)
        try {
            const {data} = await api.get(`/Sms?PageSize=${PageSize}&PageIndex=${PageIndex}`);
            setSms(data.Data.items);
            setHasMore(data.Data.items.length === pageSize);
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        fetchSMS(pageSize, pageIndex);
    }, [pageSize, pageIndex]);

    const dataSMS = sms.map((item, index) => ({
        rowNumber: index + 1,
        type: item.type,
        date: item.date,
        numberOfMessages: item.numberOfMessages,
        numberOfSent: item.numberOfSent,
        numberInQueue: item.numberInQueue,
        numberFailed: item.numberFailed,
        businessTitle: item.businessTitle,
        totalPrice: item.totalPrice,
        internalMessageStatus: item.internalMessageStatus,
    }));
    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current="سامانه پیامکی"/>

            <Box className="border-t border-Gray">
                <Box dir="rtl" display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Box className={"flex flex-col items-center gap-2"}>
                        <Typography variant="h6" fontWeight="bold" ml={2} gap={2}>
                            <StorefrontIcon sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                            سامانه پیامکی
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" py={5} justifyContent="space-between">
                    <Box
                        display="flex"
                        bgcolor="white"
                        flexDirection="column"
                        borderRadius="1rem"
                        p={5}
                        className={"w-fit"}
                    >
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight="bold" mb={5} gap={2}>
                                    درخواست های پیام
                                </Typography>
                                <DataTable data={dataSMS} columns={SMScolumns} loading={loading}/>
                                {(!dataSMS || dataSMS.length === 0) && (
                                    <Box mt={2} display="flex" justifyContent="center" alignItems="center"
                                         width="100%">
                                        <Typography variant="h6" color="textPrimary">
                                            داده‌ای یافت نشد
                                        </Typography>
                                    </Box>
                                )}
                                <Box mt={2} display="flex" alignItems="center">
                                    <FormControl size="small" variant="outlined">
                                        <InputLabel>تعداد در هر صفحه</InputLabel>
                                        <Select
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                            label="تعداد در هر صفحه"
                                        >
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Pagination
                                        count={hasMore ? pageIndex + 1 : pageIndex}
                                        page={pageIndex}
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SMSSystem;
