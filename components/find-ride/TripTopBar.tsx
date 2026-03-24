"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFindRide } from "@/context/FindRideContext";

function TripTopBar() {
  const { state } = useFindRide();

  const kmText = state.topBar.km == null ? "--" : `${state.topBar.km.toFixed(1)} km`;
  const minText = state.topBar.minutes == null ? "--" : `${state.topBar.minutes} min`;
  const costText = state.topBar.cost == null ? "--" : `₹${state.topBar.cost}`;

  // Check if we should show the info icon (only when cost is calculated and driver is linked)
  const shouldShowTooltip = state.topBar.cost != null && state.topBar.linkedDriverId != null;

  // Build tooltip content
  const tooltipContent = shouldShowTooltip ? (
    <div className="text-xs space-y-2" style={{ minWidth: "320px" }}>
      <div className="font-bold text-center mb-2">💰 FARE BREAKDOWN</div>
      
      {/* Trip Info */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>📍 Trip Distance:</span>
          <span className="font-mono">{state.topBar.km?.toFixed(1) || 0} km</span>
        </div>
        <div className="flex justify-between">
          <span>⏱️ Trip Duration:</span>
          <span className="font-mono">{state.topBar.minutes || 0} min</span>
        </div>
      </div>

      {/* Driver Pickup Distance */}
      {state.topBar.driverPickupDistance != null && (
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span>🚗 Driver Pickup Distance:</span>
            <span className="font-mono">{state.topBar.driverPickupDistance.toFixed(1)} km</span>
          </div>
          <div className="text-right text-muted-foreground text-[10px]">
            (Driver location → Pickup point)
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="border-t pt-2 space-y-1">
        {state.topBar.pickupReturnCharge != null && (
          <div className="flex justify-between">
            <span>💵 Pickup/Return Charge:</span>
            <span className="font-mono">₹{state.topBar.pickupReturnCharge}</span>
          </div>
        )}
        {state.topBar.pickupReturnCharge != null && (
          <div className="text-right text-muted-foreground text-[10px]">
            ({state.topBar.driverPickupDistance?.toFixed(1) || 0} km × ₹1 × 2)
          </div>
        )}

        {state.topBar.driverRate != null && (
          <>
            <div className="flex justify-between">
              <span>👨‍✈️ Driver Rate:</span>
              <span className="font-mono">₹{state.topBar.driverRate}</span>
            </div>
            {state.topBar.hourlyRate != null && state.topBar.tripHours != null && (
              <div className="text-right text-muted-foreground text-[10px]">
                (₹{state.topBar.hourlyRate}/hr × {state.topBar.tripHours.toFixed(2)} hr)
              </div>
            )}
          </>
        )}

        {state.topBar.ownerRate != null && (
          <>
            <div className="flex justify-between">
              <span>🚙 Vehicle Rate:</span>
              <span className="font-mono">₹{state.topBar.ownerRate}</span>
            </div>
            {state.topBar.perKmRate != null && state.topBar.km != null && (
              <div className="text-right text-muted-foreground text-[10px]">
                (₹{state.topBar.perKmRate}/km × {state.topBar.km.toFixed(1)} km)
              </div>
            )}
          </>
        )}

        {state.topBar.platformFee != null && (
          <>
            <div className="flex justify-between">
              <span>🏢 Platform Fee:</span>
              <span className="font-mono">₹{state.topBar.platformFee}</span>
            </div>
            {state.topBar.km != null && (
              <div className="text-right text-muted-foreground text-[10px]">
                (₹1/km × {state.topBar.km.toFixed(1)} km)
              </div>
            )}
          </>
        )}
      </div>

      {/* Total */}
      <div className="border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>💰 TOTAL COST:</span>
          <span className="font-mono">₹{state.topBar.cost}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Desktop TopBar */}
      <div className="hidden lg:flex sticky top-0 z-50 h-11 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur shrink-0">
        <div className="text-sm font-semibold">Find a ride</div>

        <div className="flex flex-1 items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>
            <span className="text-muted-foreground">Total Distance: </span>
            <span className="font-medium text-foreground">{kmText}</span>
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="text-muted-foreground">Total Time: </span>
            <span className="font-medium text-foreground">{minText}</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Total Cost: </span>
            <span className="font-medium text-foreground">{costText}</span>
            {shouldShowTooltip && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="p-3">
                    {tooltipContent}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
        </div>

        <Badge
          className={
            state.mode === "instant"
              ? "bg-emerald-600 hover:bg-emerald-600"
              : "bg-blue-600 hover:bg-blue-600"
          }
        >
          {state.mode === "instant" ? "Instant" : "Pre-booking"}
        </Badge>
      </div>

      {/* Mobile TopBar */}
      <div className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 px-4 py-2 backdrop-blur shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold">Find a ride</span>
          <Badge
            className={
              state.mode === "instant"
                ? "bg-emerald-600 hover:bg-emerald-600"
                : "bg-blue-600 hover:bg-blue-600"
            }
          >
            {state.mode === "instant" ? "Instant" : "Pre-booking"}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>📍 {kmText}</span>
          <span>⏱ {minText}</span>
          <span className="flex items-center gap-1">
            <span>💰 {costText}</span>
            {shouldShowTooltip && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="p-3 max-w-[320px]">
                    <div className="text-xs space-y-2">
                      <div className="font-bold text-center mb-2">💰 FARE BREAKDOWN</div>
                      
                      {/* Trip Info */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>📍 Trip:</span>
                          <span className="font-mono">{state.topBar.km?.toFixed(1) || 0} km, {state.topBar.minutes || 0} min</span>
                        </div>
                      </div>

                      {/* Driver Pickup */}
                      {state.topBar.driverPickupDistance != null && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>🚗 Pickup:</span>
                            <span className="font-mono">₹{state.topBar.pickupReturnCharge || 0}</span>
                          </div>
                        </div>
                      )}

                      {/* Cost Breakdown */}
                      <div className="space-y-1">
                        {state.topBar.driverRate != null && (
                          <div className="flex justify-between">
                            <span>👨‍✈️ Driver:</span>
                            <span className="font-mono">₹{state.topBar.driverRate}</span>
                          </div>
                        )}
                        {state.topBar.ownerRate != null && (
                          <div className="flex justify-between">
                            <span>🚙 Vehicle:</span>
                            <span className="font-mono">₹{state.topBar.ownerRate}</span>
                          </div>
                        )}
                        {state.topBar.platformFee != null && (
                          <div className="flex justify-between">
                            <span>🏢 Platform:</span>
                            <span className="font-mono">₹{state.topBar.platformFee}</span>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="border-t pt-1">
                        <div className="flex justify-between font-bold">
                          <span>💰 TOTAL:</span>
                          <span className="font-mono">₹{state.topBar.cost}</span>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

export default TripTopBar;
