"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  LogIn,
  Calendar,
  ChefHat,
  Filter,
  Utensils,
  AlertCircle,
  MessageSquare,
  Phone,
  Users,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import type { Order } from "@/types"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Playfair_Display } from "next/font/google"
import { useSettingsStore } from "@/store/settingsStore"
import { useProtectedRoute } from "@/hooks/use-protected-route"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const Orders = () => {
  useProtectedRoute() // Protect this route - only logged in users can access
  const [orders, setOrders] = useState<Order[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"orders" | "events" | "reservations">("orders")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const {deliveryFee} = useSettingsStore()

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (!token) {
        setLoading(false)
        return
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }

      try {
        const ordersResponse = await apiClient.getOrders()
        if (ordersResponse.success && ordersResponse.data) {
          const ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.data || ordersResponse.data.orders || []
          setOrders(ordersData)
          setFilteredOrders(ordersData)
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const reservationsResponse = await fetch(`${apiUrl}/api/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json()
          const resData = Array.isArray(reservationsData) ? reservationsData : reservationsData.data || []
          setReservations(resData)
          setFilteredReservations(resData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    checkAuthAndFetchData()
  }, [])

  useEffect(() => {
    if (activeTab === "orders") {
      if (activeFilter === "all") {
        setFilteredOrders(orders)
      } else {
        setFilteredOrders(orders.filter((order) => order.order_status === activeFilter))
      }
    } else {
      if (activeFilter === "all") {
        setFilteredReservations(reservations)
      } else {
        setFilteredReservations(reservations.filter((res) => res.status === activeFilter))
      }
    }
  }, [activeFilter, orders, reservations, activeTab])

  const canCancelOrder = (order: Order) => {
    const cancellableStatuses = ["pending", "confirmed"]
    return cancellableStatuses.includes(order.order_status)
  }

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order)
    setShowCancelDialog(true)
  }

  const handleCancelOrder = async () => {
    if (!orderToCancel) return

    setCancellingOrderId(orderToCancel.id)
    setShowCancelDialog(false)

    try {
      const token = localStorage.getItem("auth_token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const response = await fetch(`${apiUrl}/api/orders/${orderToCancel.id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const updatedOrders = orders.map((order) => (order.id === orderToCancel.id ? { ...order, order_status: "cancelled" as const } : order))
        setOrders(updatedOrders)
        setFilteredOrders(activeFilter === "all" ? updatedOrders : updatedOrders.filter((order) => order.order_status === activeFilter))

        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        })
      } else {
        throw new Error(data.message || "Failed to cancel order")
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancellingOrderId(null)
      setOrderToCancel(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
      case "preparing":
        return <ChefHat className="w-4 h-4" />
      case "ready":
        return <Package className="w-4 h-4" />
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "delivered":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Status badge colors kept as distinct semantic hues (so pending/confirmed/
  // delivered/cancelled stay visually distinguishable) but tuned for the
  // dark, blackened-steel background instead of a light card.
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30"
      case "confirmed":
      case "preparing":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30"
      case "ready":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30"
      case "out_for_delivery":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30"
      case "delivered":
      case "completed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      case "cancelled":
        return "bg-destructive/15 text-destructive border-destructive/30"
      default:
        return "bg-foreground/10 text-foreground/60 border-border"
    }
  }

  const getStatusCount = (status: string) => {
    if (activeTab === "orders") {
      if (status === "all") return orders.length
      return orders.filter((order) => order.order_status === status).length
    } else {
      if (status === "all") return reservations.length
      return reservations.filter((res) => res.status === status).length
    }
  }

  if (!user) {
    return (
      // `dark` forced so this page stays the same blackened-steel/copper
      // room as the rest of the site, regardless of the theme toggle.
      <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card border-accent/30 rounded-sm">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3">Welcome Back</h1>
            <p className="text-foreground/60 mb-8">Please log in to view your order history, events, and reservations.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button className="w-full rounded-sm bg-accent hover:bg-accent/85 text-accent-foreground font-bold py-6 text-lg shadow-md">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Continue
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-sm border border-accent text-accent hover:bg-accent/10 font-semibold py-6 text-lg bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentData = activeTab === "orders" ? filteredOrders : activeTab === "events" ? filteredReservations : filteredReservations

  return (
    // `dark` forced so this page stays the same blackened-steel/copper
    // room as the rest of the site, regardless of the theme toggle.
    <div className="dark py-24 bg-background text-foreground relative">
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md bg-card border-border rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-foreground">
              <AlertCircle className="w-6 h-6 text-accent" />
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2 text-foreground/60">
              Are you sure you want to cancel order <strong className="text-foreground">{orderToCancel?.order_number}</strong>?
              <br />
              <br />
              This action cannot be undone and you will need to place a new order if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="mt-0 rounded-sm bg-card border-border text-foreground hover:bg-foreground/10">
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="rounded-sm bg-destructive hover:bg-destructive/90 text-white font-semibold">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-5 lg:mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className={`${playfair.className} text-4xl md:text-5xl font-black text-foreground mb-2`}>History & Records</h1>
              <p className="text-foreground/70 text-lg">Track your orders and table bookings in one place</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <div className="flex flex-col flex-wrap space-x-4 space-y-2">
              {/* Tab buttons */}
              <div className="flex flex-col justify-center mb-6 flex-wrap max-w-lg lg:w-full">
                <button
                  onClick={() => {
                    setActiveTab("orders")
                    setActiveFilter("all")
                  }}
                  className={`flex-1 p-2 rounded-sm font-bold text-lg transition-all ${
                    activeTab === "orders"
                      ? "bg-accent text-accent-foreground shadow-lg scale-105"
                      : "bg-card text-foreground/70 hover:bg-foreground/10 shadow-md border border-border"
                  }`}
                >
                  <Package className="w-5 h-5 inline-block mr-2 mb-1" />
                  Orders ({orders.length})
                </button>
              </div>

              {/* Filters */}
              <div className="bg-card rounded-sm shadow-md p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground/80">Filter by Status</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                      activeFilter === "all" ? "bg-accent text-accent-foreground shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                    }`}
                  >
                    All ({getStatusCount("all")})
                  </button>
                  {activeTab === "orders" ? (
                    <>
                      <button
                        onClick={() => setActiveFilter("pending")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "pending" ? "bg-amber-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Pending ({getStatusCount("pending")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("confirmed")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "confirmed" ? "bg-blue-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Confirmed ({getStatusCount("confirmed")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("preparing")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "preparing" ? "bg-blue-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Preparing ({getStatusCount("preparing")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("delivered")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "delivered" ? "bg-emerald-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Delivered ({getStatusCount("delivered")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("cancelled")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "cancelled" ? "bg-destructive text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Cancelled ({getStatusCount("cancelled")})
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveFilter("pending")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "pending" ? "bg-amber-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Pending ({getStatusCount("pending")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("confirmed")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "confirmed" ? "bg-emerald-500 text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Confirmed ({getStatusCount("confirmed")})
                      </button>
                      <button
                        onClick={() => setActiveFilter("cancelled")}
                        className={`px-4 py-2 rounded-sm font-semibold text-sm transition-all ${
                          activeFilter === "cancelled" ? "bg-destructive text-white shadow-md" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
                        }`}
                      >
                        Cancelled ({getStatusCount("cancelled")})
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              {/* Empty state */}
              {currentData.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === "orders" ? <Package className="w-12 h-12 text-foreground/40" /> : <Calendar className="w-12 h-12 text-foreground/40" />}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-5">No {activeTab} found</h2>
                  {activeTab === "orders" && (
                    <Link href="/menu">
                      <Button className="rounded-sm bg-accent hover:bg-accent/85 text-accent-foreground shadow-md">Browse Menu</Button>
                    </Link>
                  )}
                  {activeTab === "reservations" && (
                    <Link href="/reservations">
                      <Button className="rounded-sm bg-accent hover:bg-accent/85 text-accent-foreground shadow-md">Make a Reservation</Button>
                    </Link>
                  )}
                </div>
              )}

              {/* View Order */}
              <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl bg-card border border-border text-foreground rounded-sm">
                  {selectedOrder && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-foreground">
                          <span>Order #{selectedOrder.order_number}</span>
                          <Badge className={getStatusColor(selectedOrder.order_status)}>
                            {getStatusIcon(selectedOrder.order_status)}
                            <span className="ml-1 capitalize">{selectedOrder.order_status.replace("_", " ")}</span>
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 mt-4">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-foreground/50">Customer</p>
                            <p className="font-semibold text-foreground">{selectedOrder.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-foreground/50">Email</p>
                            <p className="font-semibold text-foreground">{selectedOrder.customer_email}</p>
                          </div>
                          <div>
                            <p className="text-foreground/50">Phone</p>
                            <p className="font-semibold text-foreground">{selectedOrder.customer_phone}</p>
                          </div>
                          <div>
                            <p className="text-foreground/50">Date</p>
                            <p className="font-semibold text-foreground">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-foreground/80 font-semibold mb-2">Order Items</p>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {selectedOrder.order_items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center border border-border rounded-sm p-3">
                                <div>
                                  <p className="font-medium text-foreground">{item.name}</p>
                                  <p className="text-xs text-foreground/50">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-accent">₱{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Delivery Fee */}
                        <div className="flex justify-between border-t border-border pt-4 font-bold text-lg text-foreground">
                          <span>Delivery Fee</span>
                          <span className="text-accent">₱{Number(deliveryFee).toFixed(2)}</span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between border-t border-border pt-4 font-bold text-lg text-foreground">
                          <span>Total</span>
                          <span className="text-accent">₱{Number(selectedOrder.total_amount).toFixed(2)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end items-end gap-2 pt-4">
                          {canCancelOrder(selectedOrder) && (
                            <Button
                              variant="outline"
                              className="rounded-sm border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setSelectedOrder(null)
                                handleCancelClick(selectedOrder)
                              }}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-card border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer rounded-sm"
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs text-foreground/50">Order Number</p>
                            <p className="font-bold text-foreground">{order.order_number}</p>
                          </div>

                          <Badge className={getStatusColor(order.order_status)}>
                            {getStatusIcon(order.order_status)}
                            <span className="ml-1 capitalize">{order.order_status.replace("_", " ")}</span>
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm flex-1">
                          <div className="flex justify-between">
                            <span className="text-foreground/50">Date</span>
                            <span className="text-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-foreground/50">Items</span>
                            <span className="text-foreground">{order.order_items?.length || 0} items</span>
                          </div>

                          <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
                            <span className="text-foreground/80">Total</span>
                            <span className="text-accent">₱{Number(order.total_amount).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 mt-4">
                          {/* View Details */}
                          <Button
                            className="w-full rounded-sm bg-accent text-accent-foreground hover:bg-accent/85"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrder(order)
                            }}
                          >
                            View Details
                          </Button>

                          {/* Cancel Button */}
                          {canCancelOrder(order) && (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelClick(order)
                              }}
                              disabled={cancellingOrderId === order.id}
                              className="w-full rounded-sm border-destructive/50 bg-transparent hover:bg-destructive/10 text-destructive"
                            >
                              {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders