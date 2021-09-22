package com.example.demo.service;

import com.example.demo.model.User;

import java.util.List;

public interface UserService {
    User save(User user, boolean encodePassword);
    void delete(Long id);
    List<User> findAll();
    User findByUsername(String username);
    User getUser(Long id);
    User update(User user);
}
