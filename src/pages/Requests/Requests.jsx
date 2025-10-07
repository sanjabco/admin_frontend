import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import PageHeaders from "../../components/common/PageHeaders.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import {Send} from "lucide-react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination
} from "@mui/material";
import api from "../../components/auth/axiosConfig.js";


function Requests() {
    const [activeTab, setActiveTab] = useState("customerClub Requests");
    const [customerClubs, setCustomerClubs] = useState([]);
    const [smartData, setSmartData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const {id} = useParams();


    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageIndex(1);
    };

    const fetchCustomerClub = async (PageSize, PageIndex) => {
        setLoading(true);
        try {
            const {data} = await api.get(`/AdminShareCustomerClub?PageIndex=${PageIndex}&PageSize=${PageSize}`);
            setCustomerClubs(data.Data.items);
            setHasMore(data.Data.items.length === PageSize);
        } finally {
            setLoading(false);
        }
    };

    const fetchSmartData = async (PageSize, PageIndex) => {
        setLoading(true);
        try {
            const {data} = await api.get(`/smart-data/requests?PageIndex=${PageIndex}&PageSize=${PageSize}`);
            setSmartData(data.Data.items);
            setHasMore(data.Data.items.length === PageSize);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async (PageSize, PageIndex) => {
        setLoading(true);
        try {
            const {data} = await api.get(`/SelfMessage?PageIndex=${PageIndex}&PageSize=${PageSize}`);
            setCustomers(data.Data.items);
            setHasMore(data.Data.items.length === PageSize);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "customerClub Requests") {
            fetchCustomerClub(pageSize, pageIndex);
        } else if (activeTab === "smartData Requests") {
            fetchSmartData(pageSize, pageIndex);
        } else if (activeTab === "customers Requests") {
            fetchCustomers(pageSize, pageIndex);
        }
    }, [activeTab, id, pageSize, pageIndex]);

    useEffect(() => {
        setPageIndex(1);
    }, [activeTab, pageSize]);

    const handleAcceptCustomerClub = async (e, id, accept) => {
        e.stopPropagation();
        setLoading(true);
        try {
            await api.post("/AdminShareCustomerClub", {id, accept});
            await fetchCustomerClub(10, 1);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptSmartData = async (e, id, accept) => {
        e.stopPropagation();
        setLoading(true);
        try {
            await api.post("/smart-data", {id, accept});
            fetchSmartData(10, 1);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptSelfMessage = async (e, id, accept) => {
        e.stopPropagation();
        setLoading(true);
        try {
            await api.post("/SelfMessage", {id, accept});
            fetchCustomers(10, 1);
        } finally {
            setLoading(false);
        }
    };

    const CustomerClubColumns = [
        {
            accessorKey: "rowNumber",
            header: "ردیف",
            cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
        },
        {
            accessorKey: "targetBusinessTitle",
            header: "عنوان کسب و کار گیرنده",
            cell: ({row}) => row.getValue("targetBusinessTitle"),
        },
        {
            accessorKey: "eventTitle",
            header: "عنوان طرح",
            cell: ({row}) => {
                const eventTitle = row.getValue("eventTitle");
                const eventTitleMap = {
                    Message: "پیام",
                };
                return eventTitleMap[eventTitle] || "نامشخص";
            },
        },
        {
            accessorKey: "originalBusinessTitle",
            header: "عنوان کسب و کار فرستنده",
            cell: ({row}) => row.getValue("originalBusinessTitle"),
        },
        {
            accessorKey: "totalPrice",
            header: "قیمت کل",
            cell: ({row}) => {
                const value = row.getValue("totalPrice");
                return value?.toLocaleString("fa-IR");
            },
        },
        {
            accessorKey: "message",
            header: "پیام",
            cell: ({row}) => row.getValue("message"),
        },
        {
            accessorKey: "status",
            header: "وضعیت",
            cell: ({row}) => {
                const status = row.getValue("status");
                const statusMap = {
                    PendingOnBusinessApproval: "منتظر تایید کسب و کار",
                    PendingOnAdminApproval: "منتظر تایید مدیریت",
                    Accepted: "پذیرفته شده",
                    customerClub: "ارسال شده",
                    RejectedByBusiness: "رد شده توسط کسب و کار",
                    RejectedByAdmin: "رد شده توسط مدیریت",
                };
                return statusMap[status] || "نامشخص";
            },
        },
        {
            accessorKey: "type",
            header: "نوع",
            cell: ({row}) => {
                const type = row.getValue("type");
                const typeMap = {
                    Message: "پیام",
                    Cashback: "کش بک",
                    CreditEvent: "طرح اعتباری",
                };
                return typeMap[type] || "نامشخص";
            },
        },
        {
            accessorKey: "actions",
            header: "عملیات",
            cell: ({row}) => {
                return (
                    <div className="flex flex-col gap-2 justify-end">
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={(e) => handleAcceptCustomerClub(e, row.original.id, true)}
                        >
                            تایید
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => handleAcceptCustomerClub(e, row.original.id, false)}
                        >
                            رد
                        </Button>
                    </div>
                )
            },
        },
    ];

    const mapTypes = {
        Message: "پیام",
        Cashback: "بازگشت وجه",
        CreditEvent: "اعتبار"
    };

    const getPersianType = (type) => mapTypes[type] || type;

    const SmartDataColumns = [
        {
            accessorKey: "rowNumber",
            header: "ردیف",
            cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
        },
        {
            accessorKey: "eventTitle",
            header: "عنوان طرح",
            cell: ({row}) => getPersianType(row.getValue("eventTitle")),
        },
        {
            accessorKey: "requestType",
            header: "نوع درخواست",
            cell: ({row}) => getPersianType(row.getValue("requestType")),
        },
        {
            accessorKey: "messageType",
            header: "نوع پیام",
            cell: ({row}) => getPersianType(row.getValue("messageType")),
        },
        {
            accessorKey: "range",
            header: "از / تا",
            cell: ({row}) => {
                const item = smartData[row.index];
                return (
                    <div style={{whiteSpace: "nowrap"}}>
                        {item.from}
                        {item.from && item.to ? " / " : "-"}
                        {item.to}
                    </div>
                );
            },
        },
        {
            accessorKey: "smartDataTitle",
            header: "عنوان دیتا",
            cell: ({row}) => row.getValue("smartDataTitle"),
        },
        {
            accessorKey: "message",
            header: "پیام",
            cell: ({row}) => row.getValue("message"),
        },
        {
            accessorKey: "totalPrice",
            header: "قیمت",
            cell: ({row}) => {
                const value = row.getValue("totalPrice");
                return new Intl.NumberFormat("fa-IR").format(value);
            }
        },
        {
            accessorKey: "businessTitle",
            header: "نام کسب و کار",
            cell: ({row}) => row.getValue("businessTitle"),
        },
        {
            accessorKey: "creationDate",
            header: "تاریخ",
            cell: ({row}) => row.getValue("creationDate"),
        },
        {
            accessorKey: "actions",
            header: "عملیات",
            cell: ({row}) => {
                return (
                    <div className="flex flex-col gap-2 justify-end">
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={(e) => handleAcceptSmartData(e, row.original.id, true)}
                        >
                            تایید
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => handleAcceptSmartData(e, row.original.id, false)}
                        >
                            رد
                        </Button>
                    </div>
                );
            },
        },
    ];

    const CustomersColumns = [
        {
            accessorKey: "rowNumber",
            header: "ردیف",
            cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
        },
        {
            accessorKey: "creationDate",
            header: "تاریخ",
            cell: ({row}) => row.getValue("creationDate"),
        },
        {
            accessorKey: "originalBusinessTitle",
            header: "نام گسب و کار",
            cell: ({row}) => row.getValue("originalBusinessTitle"),
        },
        {
            accessorKey: "message",
            header: "پیام",
            cell: ({row}) => row.getValue("message"),
        },
        {
            accessorKey: "totalPrice",
            header: "قیمت",
            cell: ({row}) => {
                const value = row.getValue("totalPrice");
                return new Intl.NumberFormat("fa-IR").format(value);
            }
        },
        {
            accessorKey: "actions",
            header: "عملیات",
            cell: ({row}) => {
                return (
                    <div className="flex flex-col gap-2 justify-end">
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={(e) => handleAcceptSelfMessage(e, row.original.id, true)}
                        >
                            تایید
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => handleAcceptSelfMessage(e, row.original.id, false)}
                        >
                            رد
                        </Button>
                    </div>
                );
            },
        },
    ];
    const customerClubData = customerClubs.map((item, index) => ({
        id: item.id,
        rowNumber: index + 1,
        originalBusinessTitle: item.originalBusinessTitle,
        targetBusinessTitle: item.targetBusinessTitle,
        totalPrice: item.totalPrice,
        eventTitle: item.eventTitle,
        message: item.message,
        status: item.status,
        type: item.type,
    }));

    const smartDataData = smartData.map((item, index) => ({
        id: item.id,
        rowNumber: index + 1,
        requestType: item.requestType,
        messageType: item.messageType,
        eventTitle: item.eventTitle,
        smartDataTitle: item.smartDataTitle,
        businessTitle: item.businessTitle,
        totalPrice: item.totalPrice,
        message: item.message,
        creationDate: item.creationDate,
    }));

    const customersData = customers.map((item, index) => ({
        id: item.id,
        rowNumber: index + 1,
        creationDate: item.creationDate,
        totalPrice: item.totalPrice,
        message: item.message,
        originalBusinessTitle: item.originalBusinessTitle,
    }));

    let renderContent;
    if (activeTab === "customerClub Requests") {
        renderContent = (
            <Box
                display="flex"
                flexDirection="column"
                bgcolor="white"
                borderRadius="1rem"
                p={5}
            >
                {loading ? (
                    <CircularProgress/>
                ) : (
                    <>
                        <Box className="2xl:max-w-[calc(100vw-29rem)] max-w-[calc(100vw-10rem)]">
                            <DataTable data={customerClubData} columns={CustomerClubColumns}/>
                        </Box>
                        {(!customerClubData || customerClubData.length === 0) && (
                            <Box mt={2} display="flex" justifyContent="center" alignItems="center" width="100%">
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
        );
    } else if (activeTab === "smartData Requests") {
        renderContent = (
            <Box
                display="flex"
                flexDirection="column"
                bgcolor="white"
                borderRadius="1rem"
                p={5}
            >
                {loading ? (
                    <CircularProgress/>
                ) : (
                    <>
                        <Box className="2xl:max-w-[calc(100vw-29rem)] max-w-[calc(100vw-10rem)]">
                            <DataTable data={smartDataData} columns={SmartDataColumns}/>
                        </Box>
                        {(!smartDataData || smartDataData.length === 0) && (
                            <Box mt={2} display="flex" justifyContent="center" alignItems="center" width="100%">
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
        );
    } else if (activeTab === "customers Requests") {
        renderContent = (
            <Box display="flex" bgcolor="white" borderRadius="1rem" p={5} flexDirection="column"
                 className="min-w-full">
                <Box mt={4}>
                    {loading ? (
                        <CircularProgress/>
                    ) : (
                        <>
                            <DataTable data={customersData} columns={CustomersColumns}/>
                            {(!customersData || customersData.length === 0) && (
                                <Box mt={2} display="flex" justifyContent="center" alignItems="center" width="100%">
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
        );
    }

    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current="درخواست ها"/>
            <Box className="border-t border-Gray">
                <Box dir="rtl" display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Box display="flex" alignItems="center">
                        <Send sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                        <Typography variant="h6" fontWeight="bold" ml={2}>
                            درخواست ها
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Typography variant="h6" fontWeight="bold" ml={2}>
                        {activeTab === "customerClub Requests"
                            ? "درخواست‌های باشگاه مشتریان"
                            : activeTab === "smartData Requests"
                                ? "درخواست‌های دیتای هوشمند"
                                : "درخواست‌های مشتریان من"}
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        borderRadius="12px"
                        bgcolor="rgba(255, 255, 255, 0.2)"
                        p={1}
                        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                        className="backdrop-blur-[10px]"
                    >
                        {[
                            {id: "customerClub Requests", label: "باشگاه مشتریان"},
                            {id: "smartData Requests", label: "دیتای هوشمند"},
                            {id: "customers Requests", label: "مشتریان من"},
                        ].map((tab) => (
                            <Button
                                key={tab.id}
                                variant="text"
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: activeTab === tab.id ? "lightGray" : "transparent",
                                    color: activeTab === tab.id ? "black" : "gray",
                                    borderRadius: "10px",
                                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                                    mx: 0.5,
                                    px: 2,
                                    py: 1,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "lightGray",
                                    },
                                }}
                                onClick={() => changeTab(tab.id)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <Box display="flex" py={5} justifyContent="space-between">
                    {renderContent}
                </Box>
            </Box>
        </Box>
    );
}

export default Requests;
