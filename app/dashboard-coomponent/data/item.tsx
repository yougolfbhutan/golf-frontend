import DashboardPage from "@/app/admin-panel-conponent/home";
import {
  Home,
  Grid3X3,
  FileText,
  Edit3,
  Puzzle,
  MoreHorizontal,
  DollarSignIcon,
} from "lucide-react";
import Role from "../page/AcessessManagement/role/page";
import User from "../page/AcessessManagement/user/user";
import PermissionPage from "../page/AcessessManagement/permission/permission";
import Caddie from "../page/CaddieCarryset/caddie/page";
import Carryset from "../page/CaddieCarryset/carryset/page";
import GolfSouvenirs from "../page/Golf-Accessories/golf-souvenirs/page";
import ItemVariants from "../page/Golf-Accessories/golf-items/page";
import BookingPage from "../page/Booking/page";
import ApprovalItemsPage from "../page/Accessories-Item/page";
import PaymentPage from "../page/payment/page";

export const menuContent: Record<string, React.ReactNode> = {
  Dashboard: (
    <div className="text-xl font-bold">
      <DashboardPage />
    </div>
  ),
  // "Purchase Invoice Payment Approval": <PurchaseInvoicePaymentApproval />,
  // "Fixed Assets Payment":<FixedAssetsPaymentComponent/>,
  User: <User />,
  Permission: <PermissionPage />,
  Role: <Role />,
  Caddie: <Caddie />,
  Carryset: <Carryset />,
  "Souvenirs Variants": <GolfSouvenirs />,
  "Golf Items": <ItemVariants />,
  "Approve Booking": <BookingPage />,
  // Webhooks: <DepartmentComponent />,
  "Accessories Items Approval": <ApprovalItemsPage />,
  "Payments": <PaymentPage />,
  // "Product Unit Cost": <ProductUnitCostComponent />,
  // "Purchase Invoice Payment": <PurchaseInvoicePaymentComponent />,
  // "Other Production Cost": <OtherProductionCostComponent />,
  // "Labour Cost": <LabourCostComponent />,
  // Labour: <LabourComponent />,
  // "Machines Cost": <MachinesCostComponent />,
  // Machines: <MachinesComponent />,
  // "Production Batch": <ProductionBatchComponent />,
  // Customer: <Customer />,
  // "Sales": <SalesInvoicesComponent />,
  // "Sales Receipt": <SalesReceiptComponent />,
  // Forms: <div className="text-7xl font-bold">Forms</div>,
  // "Price List": <PriceListComponent />,
  // "Discount Scheme": <DiscountSchemeComponent />,
  // //ERP
  // "Leave Types": <LeaveTypesComponent />,
  // "Leave Application": <LeaveApplicationComponent />,
  // "Leave Encashment": <LeaveEncashmentComponent />,
  // Payroll: <PayRollComponent />,
  // "Purchase Approval": <PurchaseInvoicePaymentApproval />,
  // "Fixed Assets approval":<FixedAssetsApprovalComponent/>,
  // //INVENTORY MANAGEMENT
  // "Raw Material Inventory": <RawMaterialInventoryComponent />,
  // "WIP Inventory Component": <WIPInventoryComponent />,
  // //Account Costing
  // "Raw Material Categories": <RawMaterialComponent />,
  // //Assets  "Fixed Assets": <div className="text-7xl font-bold">Fixed Assets</div>,
  // "Fixed Assets": <FixedAssetsComponent />,
};
export const mainApps = [
  { label: "Access Management", icon: MoreHorizontal },
  { label: "Approval", icon: MoreHorizontal },
  { label: "Home", icon: Home },
  { label: "Applications", icon: Grid3X3 },
  { label: "Accounts Payable", icon: FileText },
  { label: "Payments", icon: DollarSignIcon },
  { label: "Sales", icon: Edit3 },
  { label: "Production Batch", icon: Puzzle },
  { label: "ERP", icon: Puzzle },
  { label: "Inventory Management", icon: MoreHorizontal },
  { label: "Master", icon: MoreHorizontal },
  { label: "Approval", icon: MoreHorizontal },
  { label: "Assets", icon: DollarSignIcon },
];

export const themeConfig = {
  light: {
    sidebarBg: "bg-white",
    headerBg: "bg-white",
    headerBorder: "border-gray-200",
    headerText: "text-gray-900",
    leftPanelBg: "bg-gray-50",
    rightPanelBg: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    hoverBg: "hover:bg-gray-100",
    activeBg: "bg-blue-100",
    activeText: "text-blue-700",
    activeBorder: "border-blue-500",
    groupTitle: "text-blue-600",
    groupTitleInactive: "text-gray-500",
  },
  dark: {
    sidebarBg: "bg-gray-900",
    headerBg: "bg-gray-800",
    headerBorder: "border-gray-700",
    headerText: "text-white",
    leftPanelBg: "bg-gray-900",
    rightPanelBg: "bg-gray-900",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    hoverBg: "hover:bg-gray-800",
    activeBg: "bg-gray-700",
    activeText: "text-white",
    activeBorder: "border-gray-400",
    groupTitle: "text-gray-300",
    groupTitleInactive: "text-gray-500",
  },
  orange: {
    sidebarBg: "bg-orange-50",
    headerBg: "bg-white",
    headerBorder: "border-orange-200",
    headerText: "text-orange-900",
    leftPanelBg: "bg-orange-100",
    rightPanelBg: "bg-orange-50",
    textPrimary: "text-orange-900",
    textSecondary: "text-orange-700",
    hoverBg: "hover:bg-orange-100",
    activeBg: "bg-orange-200",
    activeText: "text-orange-800",
    activeBorder: "border-orange-500",
    groupTitle: "text-orange-700",
    groupTitleInactive: "text-orange-500",
  },
  blue: {
    sidebarBg: "bg-blue-50",
    headerBg: "bg-white",
    headerBorder: "border-blue-200",
    headerText: "text-blue-900",
    leftPanelBg: "bg-blue-100",
    rightPanelBg: "bg-blue-50",
    textPrimary: "text-blue-900",
    textSecondary: "text-blue-700",
    hoverBg: "hover:bg-blue-100",
    activeBg: "bg-blue-200",
    activeText: "text-blue-800",
    activeBorder: "border-blue-500",
    groupTitle: "text-blue-700",
    groupTitleInactive: "text-blue-500",
  },
  green: {
    sidebarBg: "bg-green-50",
    headerBg: "bg-white",
    headerBorder: "border-green-200",
    headerText: "text-green-900",
    leftPanelBg: "bg-green-100",
    rightPanelBg: "bg-green-50",
    textPrimary: "text-green-900",
    textSecondary: "text-green-700",
    hoverBg: "hover:bg-green-100",
    activeBg: "bg-green-200",
    activeText: "text-green-800",
    activeBorder: "border-green-500",
    groupTitle: "text-green-700",
    groupTitleInactive: "text-green-500",
  },
};
