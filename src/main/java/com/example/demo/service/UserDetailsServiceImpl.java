package com.example.demo.service;

import com.example.demo.dao.UserDao;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository u;
    private final UserDao userService;

    public UserDetailsServiceImpl(UserRepository u, UserDao userService) {
        this.u = u;
        this.userService = userService;
    }
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return u.getUserByFirstNam(username);
    }
}
