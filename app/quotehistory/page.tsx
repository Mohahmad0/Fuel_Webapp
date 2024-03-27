import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Fetch and modify quote history data
const quoteHistory = [
    {
        date: "2023-12-15",
        gallonsRequested: 500,
        pricePerGallon: "$2.50",
        totalDue: "$1250.00",
        deliveryAddress: "123 Main St, Anytown, CA",
        deliveryDate: "2023-12-20"
    },
    {
        date: "2023-11-28",
        gallonsRequested: 200,
        pricePerGallon: "$2.75",
        totalDue: "$550.00",
        deliveryAddress: "456 Elm St, Sometown, TX",
        deliveryDate: "2023-12-01"
    },
];

export default function QuoteHistoryTable() {
    return (
        <main>
            <Table>
                <TableCaption>Your Fuel Quote History</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Gallons Requested</TableHead>
                        <TableHead>Price Per Gallon</TableHead>
                        <TableHead>Total Due</TableHead> 
                        <TableHead>Delivery Address</TableHead>
                        <TableHead>Delivery Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quoteHistory.map((entry) => (
                        <TableRow key={entry.date}> 
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.gallonsRequested}</TableCell>
                            <TableCell>{entry.pricePerGallon}</TableCell>
                            <TableCell>{entry.totalDue}</TableCell> 
                            <TableCell>{entry.deliveryAddress}</TableCell>
                            <TableCell>{entry.deliveryDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main >
    )
}
