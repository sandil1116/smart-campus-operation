package backend.controller;

import backend.model.Ticket;
import backend.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository repo;

    public TicketController(TicketRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/test")
    public String test() {
        return "Ticket API working";
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setPriority(detectPriority(ticket.getDescription(), ticket.getCategory()));
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(repo.save(ticket));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable String id,
            @RequestBody Ticket updatedTicket
    ) {
        return repo.findById(id)
                .map(ticket -> {
                    ticket.setTitle(updatedTicket.getTitle());
                    ticket.setDescription(updatedTicket.getDescription());
                    ticket.setCategory(updatedTicket.getCategory());
                    ticket.setCreatedByName(updatedTicket.getCreatedByName());
                    ticket.setCreatedByRole(updatedTicket.getCreatedByRole());
                    ticket.setPriority(detectPriority(updatedTicket.getDescription(), updatedTicket.getCategory()));
                    ticket.setUpdatedAt(LocalDateTime.now());

                    return ResponseEntity.ok(repo.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technician
    ) {
        return repo.findById(id)
                .map(ticket -> {
                    ticket.setAssignedTechnician(technician);
                    ticket.setStatus("IN_PROGRESS");
                    ticket.setUpdatedAt(LocalDateTime.now());

                    return ResponseEntity.ok(repo.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/admin-comment")
    public ResponseEntity<Ticket> addAdminComment(
            @PathVariable String id,
            @RequestParam String comment
    ) {
        return repo.findById(id)
                .map(ticket -> {
                    ticket.setAdminComment(comment);
                    ticket.setUpdatedAt(LocalDateTime.now());

                    return ResponseEntity.ok(repo.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNotes
    ) {
        return repo.findById(id)
                .map(ticket -> {
                    ticket.setStatus(status.toUpperCase());

                    if (resolutionNotes != null && !resolutionNotes.isBlank()) {
                        ticket.setResolutionNotes(resolutionNotes);
                    }

                    ticket.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(repo.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Ticket> completeTicket(
            @PathVariable String id,
            @RequestParam(required = false) String resolutionNotes
    ) {
        return repo.findById(id)
                .map(ticket -> {
                    ticket.setStatus("DONE");

                    if (resolutionNotes != null && !resolutionNotes.isBlank()) {
                        ticket.setResolutionNotes(resolutionNotes);
                    }

                    ticket.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(repo.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable String id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    private String detectPriority(String description, String category) {
        String text = ((description == null ? "" : description) + " " +
                (category == null ? "" : category)).toLowerCase();

        if (
                text.contains("fire") ||
                text.contains("smoke") ||
                text.contains("electric shock") ||
                text.contains("danger") ||
                text.contains("gas leak") ||
                text.contains("cannot submit") ||
                text.contains("unable to submit") ||
                text.contains("deadline") ||
                text.contains("submission failed")
        ) {
            return "HIGH";
        }

        if (
                text.contains("lms") ||
                text.contains("courseweb") ||
                text.contains("assignment") ||
                text.contains("not working") ||
                text.contains("broken") ||
                text.contains("login") ||
                text.contains("wifi") ||
                text.contains("network") ||
                text.contains("projector")
        ) {
            return "MEDIUM";
        }

        return "LOW";
    }
}