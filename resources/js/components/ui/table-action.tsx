import { Edit, Trash2, ChevronDown, Eye, QrCode, Check, X, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { usePermission } from '@/hooks/use-permission';

interface TableActionProps {
    onEdit?: (mode: boolean) => void;
    onDelete?: () => void;
    onDetail?: () => void;
    onCreateQr?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    onClearSession?: () => void;
    isCreateQrDisabled?: boolean;
    isEditDisabled?: boolean;
    className?: string;
    route?: string;
}

export default function TableAction({
    onEdit,
    onDelete,
    onDetail,
    onCreateQr,
    onApprove,
    onReject,
    onClearSession,
    isCreateQrDisabled = false,
    isEditDisabled = false,
    className = "",
    route,
}: TableActionProps) {
    const { can } = usePermission();

    const canDetail = (onDetail || onEdit) && (!route || can(`read ${route}`));
    const canEdit = onEdit && (!route || can(`update ${route}`));
    const canApprove = onApprove && (!route || can(`update ${route}`) || can(`approve ${route}`));
    const canDelete = onDelete && (!route || can(`delete ${route}`));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm">
                    Action <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {canDetail && (
                    <DropdownMenuItem onClick={() => onDetail ? onDetail() : onEdit?.(false)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                )}

                {canEdit && (
                    <DropdownMenuItem
                        onClick={!isEditDisabled ? () => onEdit?.(true) : undefined}
                        disabled={isEditDisabled}
                        className={isEditDisabled ? "" : "cursor-pointer"}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                )}

                {onCreateQr && (
                    <DropdownMenuItem
                        onClick={!isCreateQrDisabled ? onCreateQr : undefined}
                        disabled={isCreateQrDisabled}
                        className={isCreateQrDisabled ? "" : "cursor-pointer"}
                    >
                        <QrCode className="mr-2 h-4 w-4" /> Create QR
                    </DropdownMenuItem>
                )}

                {canApprove && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onApprove}
                            className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                        >
                            <Check className="mr-2 h-4 w-4 text-emerald-650" /> Approve
                        </DropdownMenuItem>
                    </>
                )}

                {onReject && (
                    <>
                        <DropdownMenuItem
                            onClick={onReject}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <X className="mr-2 h-4 w-4 text-destructive" /> Reject
                        </DropdownMenuItem>
                    </>
                )}

                {onClearSession && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onClearSession}
                            className="cursor-pointer text-orange-600 focus:text-orange-600"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-orange-600" /> Clear Session
                        </DropdownMenuItem>
                    </>
                )}

                {canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-destructive cursor-pointer focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
