package backend.controller;

import backend.model.Ticket;
import backend.repository.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5175")
public class TicketController {

    private final TicketRepository repo;

    public TicketController(TicketRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    @GetMapping("/test")
    public String test() {
        return "Ticket API working";
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return repo.save(ticket);
    }
}