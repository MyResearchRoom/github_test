import React from 'react'

export const DetailItem = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <Icon size={17} className="text-[#7C3AED]" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-[#8BA3CB] mb-0.5">{label}</p>
                <p className="text-sm font-medium text-[#343C6A] break-words">
                    {value || "-"}
                </p>
            </div>
        </div>
    )
}
