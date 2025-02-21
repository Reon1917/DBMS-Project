// Calculate number of 15-minute slots needed for a duration
export function calculateRequiredSlots(durationMinutes) {
  return Math.ceil(durationMinutes / 15);
}

// Get consecutive slot IDs starting from a given slot
export function getConsecutiveSlots(startSlotId, numSlots) {
  return Array.from({ length: numSlots }, (_, i) => startSlotId + i);
}

// Check if a sequence of slots is available
export function areSlotsAvailable(startSlotId, numSlots, availableSlotIds) {
  const requiredSlots = getConsecutiveSlots(startSlotId, numSlots);
  return requiredSlots.every(slotId => availableSlotIds.includes(slotId));
}

// Group available slots into valid time blocks based on service duration
export function groupAvailableSlots(slots, requiredSlots) {
  const validTimeBlocks = [];
  const sortedSlots = [...slots].sort((a, b) => a.slotId - b.slotId);

  for (let i = 0; i <= sortedSlots.length - requiredSlots; i++) {
    const currentSlot = sortedSlots[i];
    const consecutive = getConsecutiveSlots(currentSlot.slotId, requiredSlots);
    
    // Check if all required consecutive slots are available
    const isValidBlock = consecutive.every(slotId => 
      sortedSlots.find((s, index) => 
        s.slotId === slotId && index < i + requiredSlots
      )
    );

    if (isValidBlock) {
      const endSlot = sortedSlots.find(s => s.slotId === consecutive[consecutive.length - 1]);
      validTimeBlocks.push({
        startSlot: currentSlot,
        endSlot,
        slotIds: consecutive,
        displayTime: `${currentSlot.startTime} - ${endSlot.endTime}`
      });
    }
  }

  return validTimeBlocks;
}

// Format time for display
export function formatTimeBlock(startTime, endTime) {
  return `${startTime} - ${endTime}`;
} 