"use client"

import {
  Home,
  Package,
  Megaphone,
  Users,
  ShoppingCart,
  LogOut,
  ChevronDown,
  Calendar,
  Mail,
  Settings,
} from "lucide-react"
import logo from "@/assets/logo.jpg"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import Image from "next/image"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

// Grouped by function so related sections sit together in the sidebar
// instead of one flat list.
const groups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin/dashboard", icon: Home }],
  },
  {
    label: "Operations",
    items: [
      { title: "Products", url: "/admin/product", icon: Package },
      { title: "Orders", url: "/admin/order", icon: ShoppingCart },
      { title: "Reservations", url: "/admin/reservations", icon: Calendar },
    ],
  },
  {
    label: "Engagement",
    items: [
      { title: "Inquiries", url: "/admin/contacts", icon: Mail },
      {
        title: "Content Management",
        icon: Megaphone,
        items: [
          { title: "Announcements", url: "/admin/announcements" },
          { title: "Blog Posts", url: "/admin/blog" },
          { title: "Testimonials", url: "/admin/testimonials" },
        ],
      },
    ],
  },
  {
    label: "People",
    items: [{ title: "Customers", url: "/admin/users", icon: Users }],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpen, isMobile } = useSidebar()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const handleNavigate = () => {
    if (isMobile) setOpen(false)
  }

  return (
    // `dark` forced so the admin panel stays the same blackened-steel/copper
    // look as the rest of the site, regardless of the theme toggle.
    <Sidebar
      collapsible="offcanvas"
      className="dark border-r border-sidebar-border"
    >
      <SidebarContent className="bg-sidebar lg:px-5">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 tracking-wide uppercase text-xs">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isParentActive =
                    item.items?.some((sub) => pathname.startsWith(sub.url)) ??
                    false

                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.items ? (
                        <Collapsible defaultOpen={isParentActive}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="mx-1 rounded-sm">
                              <item.icon className="h-5 w-5 text-sidebar-foreground/70" />
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-6 mt-1">
                              {item.items.map((sub) => (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === sub.url}
                                    onClick={handleNavigate}
                                  >
                                    <Link
                                      href={sub.url}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-accent" />
                                      {sub.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                          onClick={handleNavigate}
                          className="mx-1 rounded-sm"
                        >
                          <Link
                            href={item.url!}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="h-5 w-5 text-sidebar-foreground/70" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => router.push("/")}
        >
          <Home className="h-4 w-4 mr-2 text-sidebar-foreground/70" />
          Go Back to Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 text-sidebar-foreground/70" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
