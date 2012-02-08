#!/usr/bin/perl

use Algorithm::Simplex::Rational;
my $matrix = [
    [ 5,  2,  30],
    [ 3,  4,  20],
    [10,  8,   0],
];
my $tableau = 
  Algorithm::Simplex::Rational->new( tableau => $matrix );
$tableau->solve;

print Dumper $tableau->display_tableau;