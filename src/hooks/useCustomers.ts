import { useCallback, useEffect, useState } from "react";
import {
    Customer,
    CustomerInput,
    CustomerService,
    ImportResult,
} from "@/lib/customerService";
import { useToast } from "@/hooks/use-toast";

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch all customers
    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await CustomerService.getAllCustomers();
            setCustomers(data);
        } catch (err: any) {
            setError(err.message);
            toast({
                title: "Error",
                description: "Failed to fetch customers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Add customer
    const addCustomer = async (
        customerData: CustomerInput,
    ): Promise<Customer | null> => {
        try {
            const newCustomer = await CustomerService.createCustomer(
                customerData,
            );
            setCustomers((prev) => [newCustomer, ...prev]);

            toast({
                title: "Success",
                description:
                    `Customer ${newCustomer.name} added successfully with ID: ${newCustomer.custom_id}`,
            });

            return newCustomer;
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to add customer",
                variant: "destructive",
            });
            return null;
        }
    };

    // Update customer
    const updateCustomer = async (
        id: string,
        customerData: Partial<CustomerInput>,
    ): Promise<Customer | null> => {
        try {
            const updatedCustomer = await CustomerService.updateCustomer(
                id,
                customerData,
            );
            setCustomers((prev) =>
                prev.map((c) => (c.id === id ? updatedCustomer : c))
            );

            toast({
                title: "Success",
                description: "Customer updated successfully",
            });

            return updatedCustomer;
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update customer",
                variant: "destructive",
            });
            return null;
        }
    };

    // Delete customer
    const deleteCustomer = async (id: string): Promise<boolean> => {
        try {
            const success = await CustomerService.deleteCustomer(id);
            if (success) {
                setCustomers((prev) => prev.filter((c) => c.id !== id));
                toast({
                    title: "Success",
                    description: "Customer deleted successfully",
                });
            }
            return success;
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to delete customer",
                variant: "destructive",
            });
            return false;
        }
    };

    // Import customers
    const importCustomers = async (
        customersData: CustomerInput[],
        fileName: string,
    ): Promise<ImportResult> => {
        try {
            const result = await CustomerService.importCustomers(
                customersData,
                fileName,
            );

            if (result.success) {
                await fetchCustomers(); // Refresh the list

                toast({
                    title: "Import Complete",
                    description:
                        `Successfully imported ${result.imported} customers. ${result.failed} failed.`,
                    variant: result.failed > 0 ? "default" : "default",
                });
            }

            return result;
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to import customers",
                variant: "destructive",
            });

            return {
                success: false,
                imported: 0,
                failed: customersData.length,
                errors: [err.message],
            };
        }
    };

    // Search customers
    const searchCustomers = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            await fetchCustomers();
            return;
        }

        try {
            setLoading(true);
            const data = await CustomerService.searchCustomers(searchTerm);
            setCustomers(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to search customers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter by status
    const filterByStatus = async (status: string) => {
        if (status === "all") {
            await fetchCustomers();
            return;
        }

        try {
            setLoading(true);
            const data = await CustomerService.filterCustomersByStatus(status);
            setCustomers(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to filter customers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return {
        customers,
        loading,
        error,
        fetchCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        importCustomers,
        searchCustomers,
        filterByStatus,
    };
};

// Hook for customer statistics
export const useCustomerStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await CustomerService.getCustomerStats();
            setStats(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to fetch statistics",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, fetchStats };
};

// Hook for single customer
export const useCustomer = (id: string | null) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchCustomer = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await CustomerService.getCustomerById(id);
            setCustomer(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to fetch customer details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [id, toast]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    return { customer, loading, fetchCustomer };
};
