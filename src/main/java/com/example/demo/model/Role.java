package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "roles")
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roleName;
    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "roles_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonBackReference
    private List<User> users;

    public Role() {
    }

    public Role(String roleName) {
        this.roleName = roleName;
    }

    @Override
    @JsonIgnore
    public String getAuthority() {
        return roleName;
    }

    @Override
    public String toString() {
        return roleName;
    }
}
